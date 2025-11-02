import { Page, expect } from '@playwright/test';

export class CarModelPage {
  constructor(private page: Page) {}

  private get commentTextarea() {
    return this.page.locator('textarea#comment[ngmodel]');
  }

  private get voteButton() {
    return this.page.locator('button.btn-success:has-text("Vote!")');
  }

  private get commentsTable() {
    return this.page.locator('table.table tbody tr');
  }

  private get requiredMessageError() {
    return this.page.locator('p.card-text:has-text("You need to be logged in to vote.")');
  }

  private get requiredMessage() {
    return this.page.locator('p.card-text:has-text("Thank you for your vote!")');
  }

  async enterComment(comment: string) {
    // Wait for Angular to finish loading
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
    await this.page.waitForSelector('textarea#comment[ngmodel]', {state: 'visible', timeout: 15000});
    
    // Now try to fill
    await this.commentTextarea.clear();
    await this.commentTextarea.fill(comment);
    
    // Verify the text was entered
    const enteredText = await this.commentTextarea.inputValue();
    if (enteredText !== comment) {
      console.log('Text not entered correctly, retrying...');
      await this.page.waitForTimeout(2000);
      await this.commentTextarea.clear();
      await this.commentTextarea.fill(comment);
    }
  }

  async clickVote() {
    await this.voteButton.click();
    await this.page.waitForLoadState('networkidle');
    // Wait longer for comment to appear in table
    await this.page.waitForTimeout(5000);
  }

  async getLatestComment() {
    // Wait for the table to update
    await this.page.waitForTimeout(2000);
    const firstRow = this.commentsTable.first();
    const commentCell = firstRow.locator('td').nth(2);
    return await commentCell.textContent();
  }

  async verifyCommentInTable(expectedComment: string) {
    const latestComment = await this.getLatestComment();
    expect(latestComment?.trim()).toBe(expectedComment);
    console.log(`*Vote and comment sent succesfully`);
  }

  async verifyCommentFieldNotVisible() {
    await expect(this.commentTextarea).not.toBeVisible();
  }

  async verifyVoteButtonNotVisible() {
    await expect(this.voteButton).not.toBeVisible();
  }

  async verifyMessageDisplayed(message: string) {
    await expect(this.requiredMessageError).toBeVisible();
    const messageText = await this.requiredMessageError.textContent();
    expect(messageText?.trim()).toBe(message);
  }

  async verifySuccessMessageDisplayed(message: string) {
    await this.page.waitForTimeout(5000);
    await expect(this.requiredMessage).toBeVisible();
    const messageText = await this.requiredMessage.textContent();
    expect(messageText?.trim()).toBe(message);
  }

  async verifyTableStructure() {
    // Verify table exists
    const table = this.page.locator('table.table');
    await expect(table).toBeVisible();

    // Verify table headers (Date, Author, Comment)
    const headers = table.locator('thead th');
    await expect(headers).toHaveCount(3);
    await expect(headers.nth(0)).toHaveText('Date');
    await expect(headers.nth(1)).toHaveText('Author');
    await expect(headers.nth(2)).toHaveText('Comment');

    // Verify at least one row exists in tbody
    const rows = this.commentsTable;
    await expect(rows.first()).toBeVisible();
    console.log(`*Table with Date, Author and comment columns is visible`);
  }

  async getCarName() {
    const carNameElement = this.page.locator('h3');
    await expect(carNameElement).toBeVisible();
    const carName = await carNameElement.textContent();
    return carName?.trim() || '';
  }

  async getCarDescription() {
    const descriptionContainer = this.page.locator('div.row:has(h3) div');
    await expect(descriptionContainer).toBeVisible();
    const description = await descriptionContainer.textContent();
    return description?.trim() || '';
  }

  async getCarSpecifications() {
    const specCard = this.page.locator('.card:has(h4:has-text("Specification"))');
    await expect(specCard).toBeVisible();
    const engineElement = specCard.locator('li:has(strong:has-text("Engine:"))');
    const maxSpeedElement = specCard.locator('li:has(strong:has-text("Max Speed:"))');
    const engineText = await engineElement.textContent();
    const maxSpeedText = await maxSpeedElement.textContent();
    const engine = engineText?.replace('Engine:', '').trim() || '';
    const maxSpeed = maxSpeedText?.replace('Max Speed:', '').trim() || '';
    return {engine,maxSpeed};
  }

  async getCarVotes() {
    const votesCard = this.page.locator('.card:has(h4:has-text("Votes:"))');
    await expect(votesCard).toBeVisible();
    const votesElement = votesCard.locator('h4 strong');
    const votesText = await votesElement.textContent();
    return votesText?.trim() || '';
  }

  
}