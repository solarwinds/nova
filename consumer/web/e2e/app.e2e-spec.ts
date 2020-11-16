import { browser } from "protractor";

import { Helper } from "./helper";
import { AppPage } from "./page-objects/app.po";

describe("AppPage", () => {
    let page: AppPage;

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
    });

    afterAll(async () => {
        await browser.waitForAngularEnabled(true);
    });

    describe("Initial state >", () => {
        beforeAll(async () => {
            page = new AppPage();
            await page.navigateTo();
        });

        it("should display page header", async () => {
            expect(await page.getHeaderText()).toEqual("Rubber Duck");
        });

        it("should display 'Register' button in header", async () => {
            expect(await page.registerButton.getElement().isDisplayed()).toEqual(true);
            expect(await page.registerButton.getText()).toEqual("Register");
            expect(await page.registerButton.hasClass("btn-action")).toEqual(true);
        });

        it("should display 'Ask your question' button in header", async () => {
            expect(await page.askQuestionButton.getElement().isDisplayed()).toEqual(true);
            expect(await page.askQuestionButton.getText()).toEqual("Ask your question");
            expect(await page.askQuestionButton.hasClass("btn-primary")).toEqual(true);
        });

        it("should display 'Login' button in header", async () => {
            expect(await page.loginButton.getElement().isDisplayed()).toEqual(true);
            expect(await page.loginButton.getText()).toEqual("Login");
            expect(await (await page.loginButton.getIcon()).getName()).toEqual("user");
            expect(await page.loginButton.hasClass("btn-default")).toEqual(true);
        });

        it("should not display logout button in header", async () => {
            expect(await page.logoutButton.getElement().isPresent()).toEqual(false);
        });

    });

    describe("Authentication", () => {

        beforeEach(async () => {
            page = new AppPage();
            await page.navigateTo();
        });

        describe("invalid users", () => {
            const invalidUsers = [
                { username: "bob", password: "y" },
                { username: "joe", password: "wrong password" },
            ];

            for (const invalidUser of invalidUsers) {

                it(`should not authenticate user '${invalidUser.username}' with password '${invalidUser.password}'`, async () => {
                    expect(await page.isLoggedIn()).toBe(false);

                    await page.logIn(invalidUser.username, invalidUser.password);

                    expect(await page.isLoggedIn()).toBe(false);
                });

            }
        });

        describe("valid users", () => {
            const validUsers = [
                { username: "joe", password: "x" },
            ];

            for (const validUser of validUsers) {

                it(`should successfully authenticate user '${validUser.username}' with password '${validUser.password}' and log him out`, async () => {
                    expect(await page.isLoggedIn()).toBe(false);

                    await page.logIn(validUser.username, validUser.password);
                    await Helper.waitForUrl("/questions");

                    expect(await page.isLoggedIn()).toBe(true);
                    expect(await page.getUsername()).toEqual(validUser.username);

                    await page.logOut();

                    expect(await page.isLoggedIn()).toBe(false);
                });

            }
        });

    });
});
