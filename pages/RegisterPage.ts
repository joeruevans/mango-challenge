import { Page } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  private get registerLink() {
    return this.page.locator('a.btn.btn-success-outline[href="/register"]');
  }

  private get usernameInput() {
    return this.page.locator('input#username[name="username"]');
  }

  private get firstNameInput() {
    return this.page.locator('input#firstName[name="firstName"]');
  }

  private get lastNameInput() {
    return this.page.locator('input#lastName[name="lastName"]');
  }

  private get passwordInput() {
    return this.page.locator('input#password[name="password"]');
  }

  private get confirmPasswordInput() {
    return this.page.locator('input#confirmPassword[name="confirmPassword"]');
  }

  private get registerButton() {
    return this.page.locator('button.btn.btn-default[type="submit"]');
  }

  private get buggyRatingLink() {
    return this.page.locator('a.navbar-brand[href="/"]');
  }

  async clickRegisterLink() {
    await this.registerLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);
  }

  async fillRegistrationForm(username: string, firstName: string, lastName: string, password: string) {
    await this.usernameInput.fill(username);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async clickRegisterButton() {
    await this.registerButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(4000);
  }

  async returnToHomepage() {
    await this.buggyRatingLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}