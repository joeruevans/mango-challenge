import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { OverallPage } from '../pages/OverallPage';
import { CarModelPage } from '../pages/CarModelPage';

test.describe('Register, login and vote with comment', () => {
  test('Verify user can vote and leave a comment', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 120 seconds
    
    const homePage = new HomePage(page);
    const registerPage = new RegisterPage(page);
    const overallPage = new OverallPage(page);
    const carPage = new CarModelPage(page);

    // Generate user data
    const randomNumber = faker.number.int({ min: 1000, max: 9999 });
    const username = `joel_gonzalez_${randomNumber}`;
    const firstName = 'joel';
    const lastName = 'gonzalez';
    const password = 'Test1234!';
    const message = 'Thank you for your vote!';

    // Car model configuration
    const carHref = '/model/ckl2phsabijs71623vk0|ckl2phsabijs71623vlg';

    // Generate fake comment data
    const fakeComment = faker.lorem.sentence();
    console.log(`Generated comment: ${fakeComment}`);

    // Register
    await homePage.goto();
    await registerPage.clickRegisterLink();
    await registerPage.fillRegistrationForm(username, firstName, lastName, password);
    await registerPage.clickRegisterButton();

    // Log in
    await registerPage.returnToHomepage();
    await homePage.loginFromHomepage(username, password);

    // Pick car
    await overallPage.navigateToOverall();
    await overallPage.clickCarAfterWait(carHref);

    //Assert car info is visible
    const carName = await carPage.getCarName();
    console.log(`*Car Name is visible. Content: ${carName}`);
    const specifications = await carPage.getCarSpecifications();
    console.log(`*Specifications are visible. Content: - Engine: ${specifications.engine}, Max Speed: ${specifications.maxSpeed}`);
    const votes = await carPage.getCarVotes();
    console.log(`*Votes are visible. Content: ${votes}`);
    const description = await carPage.getCarDescription();
    console.log(`*Description is visible. Content: ${description.substring(0, 100)}...`);

    // Send a vote with comment (only if users have an active section)
    await carPage.enterComment(fakeComment);
    await carPage.clickVote();
    await carPage.verifySuccessMessageDisplayed(message);
    await carPage.verifyCommentInTable(fakeComment);

    // Verify table structure
    await carPage.verifyTableStructure();
  });

  test('Verify a message is displayed and vote button and comment field are hidden when not logged in', async ({ page }) => {
    test.setTimeout(60000); // Set timeout to 60 seconds
    const homePage = new HomePage(page);
    const overallPage = new OverallPage(page);
    const carPage = new CarModelPage(page);
    const errorMessage = 'You need to be logged in to vote.';
    
    // Car model configuration
    const carHref = '/model/ckl2phsabijs71623vk0|ckl2phsabijs71623vlg';

    // Go to selected car page
    await homePage.goto();
    await overallPage.navigateToOverall();
    await overallPage.clickCarAfterWait(carHref);

    // Assert a message is displayed and vote button and comment field are hidden when not logged in
    await carPage.verifyCommentFieldNotVisible();
    await carPage.verifyVoteButtonNotVisible();
    await carPage.verifyMessageDisplayed(errorMessage);
  });
});
