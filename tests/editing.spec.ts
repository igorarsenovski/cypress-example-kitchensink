import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.describe('Editing tasks', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigateTo();
    // Reset the app state before each test
    await todoPage.deleteAllTasks();
  });

  test('Edit an existing task', async () => {
    await todoPage.addTask('Study chess openings');

    await todoPage.editTask('Study chess openings', 'Review chess game');

    await expect(todoPage.getTaskByName('Review chess game')).toBeVisible();
    await expect(todoPage.getTaskByName('Study chess openings')).not.toBeVisible();
    await expect(todoPage.tasks).toHaveCount(1);
    await expect(todoPage.footer).toContainText('1 item left');
  });

  test('Edit a task with an empty value', async () => {
    await todoPage.addTask('Hike Vodno mountain');

    await todoPage.clearTaskNameAndPressEnter('Hike Vodno mountain');

    await expect(todoPage.getTaskByName('Hike Vodno mountain')).not.toBeVisible();
    await expect(todoPage.tasks).toHaveCount(0);
  });
});