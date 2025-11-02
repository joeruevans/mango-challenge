import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  private get usernameInput() {
    return this.page.locator('input[name="login"]');
  }

  private get passwordInput() {
    return this.page.locator('input[name="password"]');
  }

  private get loginButton() {
    return this.page.locator('button.btn-success[type="submit"]');
  }

  async goto() {
    await this.page.goto('https://buggy.justtestit.org');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async loginFromHomepage(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }
}