import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.describe('Completing tasks', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigateTo();
    // Reset the app state before each test
    await todoPage.deleteAllTasks();
  });

  test('Mark an active task as completed', async () => {
    await todoPage.addTask('Practice double unders');

    await todoPage.toggleTask('Practice double unders');

    await expect(todoPage.getTaskByName('Practice double unders')).toHaveClass(/completed/);
    await expect(todoPage.footer).toContainText('0 items left');
  });

  test('Mark a completed task as active', async () => {
    await todoPage.addTask('Evening dog walk with Lara');

    await todoPage.toggleTask('Evening dog walk with Lara');
    await todoPage.toggleTask('Evening dog walk with Lara');

    await expect(todoPage.getTaskByName('Evening dog walk with Lara')).not.toHaveClass(/completed/);
    await expect(todoPage.footer).toContainText('1 item left');
  });

  test('Mark all tasks as completed', async () => {
    await todoPage.addTask('Buy groceries');
    await todoPage.addTask('Pay electricity bill');
    await todoPage.addTask('Walk the dog');

    await todoPage.toggleAllTasks();

    await expect(todoPage.getTaskByName('Buy groceries')).toHaveClass(/completed/);
    await expect(todoPage.getTaskByName('Pay electricity bill')).toHaveClass(/completed/);
    await expect(todoPage.getTaskByName('Walk the dog')).toHaveClass(/completed/);
    await expect(todoPage.footer).toContainText('0 items left');
  });

  test('Mark all tasks as active', async () => {
    await todoPage.addTask('Buy groceries');
    await todoPage.addTask('Pay electricity bill');
    await todoPage.addTask('Walk the dog');

    await todoPage.toggleAllTasks();
    await todoPage.untoggleAllTasks();

    await expect(todoPage.getTaskByName('Buy groceries')).not.toHaveClass(/completed/);
    await expect(todoPage.getTaskByName('Pay electricity bill')).not.toHaveClass(/completed/);
    await expect(todoPage.getTaskByName('Walk the dog')).not.toHaveClass(/completed/);
    await expect(todoPage.footer).toContainText('3 items left');
  });

  test('Clear completed tasks', async () => {
    await todoPage.addTask('Take magnesium supplement');
    await todoPage.addTask('5km run');
    await todoPage.addTask('Buy birthday gift');

    await todoPage.toggleTask('5km run');
    await todoPage.toggleTask('Buy birthday gift');

    await todoPage.clearCompletedButton.click();

    await expect(todoPage.getTaskByName('Take magnesium supplement')).toBeVisible();
    await expect(todoPage.getTaskByName('5km run')).not.toBeVisible();
    await expect(todoPage.getTaskByName('Buy birthday gift')).not.toBeVisible();

    await expect(todoPage.tasks).toHaveCount(1);
    await expect(todoPage.footer).toContainText('1 item left');
  });
});