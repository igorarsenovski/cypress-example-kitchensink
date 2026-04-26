import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.describe('Filtering tasks', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigateTo();
    // Reset the app state before each test
    await todoPage.deleteAllTasks();
  });

  test('Filter active tasks', async () => {
    await todoPage.addTask('Reply to emails');
    await todoPage.addTask('Plan weekend trip');
    await todoPage.addTask('Update resume');

    await todoPage.toggleTask('Plan weekend trip');
    await todoPage.filterBy('Active');

    await expect(todoPage.getTaskByName('Reply to emails')).toBeVisible();
    await expect(todoPage.getTaskByName('Update resume')).toBeVisible();
    await expect(todoPage.getTaskByName('Plan weekend trip')).not.toBeVisible();
    await expect(todoPage.footer).toContainText('2 items left');
  });

  test('Filter completed tasks', async () => {
    await todoPage.addTask('Reply to emails');
    await todoPage.addTask('Plan weekend trip');
    await todoPage.addTask('Watch tutorial on Playwright');

    await todoPage.toggleTask('Plan weekend trip');
    await todoPage.toggleTask('Watch tutorial on Playwright');
    await todoPage.filterBy('Completed');

    await expect(todoPage.getTaskByName('Plan weekend trip')).toBeVisible();
    await expect(todoPage.getTaskByName('Watch tutorial on Playwright')).toBeVisible();
    await expect(todoPage.getTaskByName('Reply to emails')).not.toBeVisible();
    await expect(todoPage.footer).toContainText('1 item left');
  });

  test('Show all tasks', async () => {
    await todoPage.addTask('Schedule dentist appointment');
    await todoPage.addTask('Backup laptop files');
    await todoPage.addTask('Organize workspace');

    await todoPage.toggleTask('Backup laptop files');
    await todoPage.filterBy('All');

    await expect(todoPage.getTaskByName('Schedule dentist appointment')).toBeVisible();
    await expect(todoPage.getTaskByName('Backup laptop files')).toBeVisible();
    await expect(todoPage.getTaskByName('Organize workspace')).toBeVisible();
    await expect(todoPage.footer).toContainText('2 items left');
  });
});