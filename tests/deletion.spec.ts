import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.describe('Deleting tasks', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigateTo();
    // Reset the app state before each test
    await todoPage.deleteAllTasks();

  });

  test('Delete a task', async () => {
    await todoPage.addTask('Finish AMRAP workout');
    await todoPage.deleteTask('Finish AMRAP workout');

    await expect(todoPage.getTaskByName('Finish AMRAP workout')).not.toBeVisible();
  });
});