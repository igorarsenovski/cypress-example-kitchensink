import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;

  // Locators
  readonly input: Locator;
  readonly tasks: Locator;
  readonly toggleAll: Locator;
  readonly clearCompletedButton: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;

    this.input = page.getByTestId('new-todo');
    this.tasks = page.locator('.todo-list li');
    this.toggleAll = page.locator('label[for="toggle-all"]');
    this.clearCompletedButton = page.locator('.clear-completed');
    this.footer = page.locator('.footer');
  }

  // Navigation
  async navigateTo() {
    await this.page.goto('/todo');
  }

  // Actions
  async addTask(taskName: string) {
    await this.input.fill(taskName);
    await this.input.press('Enter');
  }

  async deleteTask(taskName: string) {
    const task = this.getTaskByName(taskName);
    // Hover is required to reveal the delete button
    await task.hover();
    await task.locator('.destroy').click();
  }

  async deleteAllTasks() {
    while (await this.tasks.count() > 0) {
        const firstTask = this.tasks.first();
        await firstTask.hover();
        await firstTask.locator('.destroy').click();
    }
  }

  async clearTaskNameAndPressEnter(taskName: string) {
    const task = this.getTaskByName(taskName);

    // Double click is required to be able to edit the task name
    await task.dblclick();
    const input = task.locator('.edit');

    // Clearing input and pressing Enter deletes the task
    await input.fill('');
    await input.press('Enter');
  }

  async toggleTask(taskName: string) {
    const task = this.getTaskByName(taskName);
    await task.locator('.toggle').click();
  }

  async toggleAllTasks() {
    await this.toggleAll.check();
  }

  async untoggleAllTasks() {
    await this.toggleAll.uncheck();
  }

  async editTask(oldName: string, newName: string) {
    const task = this.getTaskByName(oldName);

    await task.dblclick();
    const input = task.locator('.edit');

    await input.fill(newName);
    await input.press('Enter');
  }

  async filterBy(filter: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name: filter }).click();
  }

  // Helper
  getTaskByName(taskName: string): Locator {
    return this.tasks.filter({ hasText: taskName });
  }

}