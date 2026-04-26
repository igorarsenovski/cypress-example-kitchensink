import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.describe('Task creation', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigateTo();
    // Reset the app state before each test
    await todoPage.deleteAllTasks();

  });

    test('Application loads successfully', async () => {
        await expect(todoPage.input).toBeVisible();
    });

    test('Create a new task', async () => {
        await todoPage.addTask('Wash the car');

        await expect(todoPage.getTaskByName('Wash the car')).toBeVisible();
        await expect(todoPage.getTaskByName('Wash the car')).not.toHaveClass(/completed/);
        await expect(todoPage.footer).toContainText('1 item left');
    });

    test('Create multiple tasks with the same name', async () => {
        await todoPage.addTask('Read Psychology of Money');
        await todoPage.addTask('Read Psychology of Money');

        await expect(todoPage.tasks).toHaveCount(2);
        await expect(todoPage.getTaskByName('Read Psychology of Money')).toHaveCount(2);
        await expect(todoPage.footer).toContainText('2 items left');
    });

    // Test case based on Gherkin scenario outline
    const invalidTaskInputs = [
      { name: 'empty', value: '' },
      { name: 'single whitespace', value: ' ' },
      { name: 'multiple whitespace', value: '   ' },
    ];

    for (const input of invalidTaskInputs) {
      test(`Do not allow creating tasks with invalid names - ${input.name}`, async () => {
        await todoPage.addTask(input.value);

        await expect(todoPage.tasks).toHaveCount(0);
      });
    }
});
