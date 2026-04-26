import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.describe('On page reload', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigateTo();
  });

  test('Tasks stay after refresh', async () => {
    await todoPage.deleteAllTasks();
    await todoPage.addTask('Do 50 burpees');

    await todoPage.page.reload();

    await expect(todoPage.getTaskByName('Do 50 burpees')).toBeVisible();
  });


  // Bug is tracked in GitHub issue #1
  test.skip('Empty task list stays empty after refresh', async () => {
    await todoPage.deleteAllTasks();
    await expect(todoPage.tasks).toHaveCount(0);

    await todoPage.page.reload();

    await expect(todoPage.tasks).toHaveCount(0);
    await expect(todoPage.getTaskByName('Pay electric bill')).not.toBeVisible();
    await expect(todoPage.getTaskByName('Walk the dog')).not.toBeVisible();
  });
});