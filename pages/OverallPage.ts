import { Page, expect } from '@playwright/test';

export class OverallPage {
  constructor(private page: Page) {}

  private get overallLink() {
    return this.page.locator('a[href="/overall"]');
  }

  private getCarLink(href: string) {
    return this.page.locator(`a[href="${href}"]`).first();
  }

  async navigateToOverall() {
    await this.overallLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('img[src="/img/spin.gif"]', { state: 'hidden', timeout: 10000 });
  }

  async clickCarAfterWait(href: string) {
    await this.page.waitForTimeout(3000);
    await this.getCarLink(href).click();
    await this.page.waitForLoadState('networkidle');
    // Extra wait for the car page to fully load
    await this.page.waitForTimeout(4000);
  }


}