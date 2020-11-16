import { browser } from "protractor";

import { Helper } from "./helper";
import { CreateQuestionPage } from "./page-objects/create-question.po";
import { QuestionListPage } from "./page-objects/question-list.po";
import { QuestionWorkflow } from "./workflows/question-workflow";

describe("Create Question >", () => {
    let page: CreateQuestionPage;

    beforeAll(async () => {
        page = new CreateQuestionPage();
        await browser.waitForAngularEnabled(false);
    });

    afterAll(async () => {
        await browser.waitForAngularEnabled(true);
    });

    describe("Initial state >", () => {
        beforeAll(async () => {
            await page.navigateTo();
        });

        it("should display page header", async () => {
            expect(await page.getHeaderText()).toEqual("Your question");
        });

        it("should display title textbox", async () => {
            expect(await page.titleTextbox.getElement().isDisplayed()).toEqual(true);
        });

        it("should display text textbox", async () => {
            expect(await page.postForm.textTextbox.getElement().isDisplayed()).toEqual(true);
        });

        it("should display author signature textbox", async () => {
            expect(await page.postForm.authorTextbox.getElement().isDisplayed()).toEqual(true);
        });

        it("should display post button", async () => {
            expect(await page.submitButton.getElement().isDisplayed()).toEqual(true);
        });

        it("should display cancel button", async () => {
            expect(await page.cancelButton.getElement().isDisplayed()).toEqual(true);
        });
    });

    describe("Scenarios > ", () => {
        beforeEach(async () => {
            await page.navigateTo();
        });

        afterAll(async () => {
            await QuestionWorkflow.deleteAllQuestions();
        });

        it("should validate the form", async () => {
            await page.titleTextbox.acceptText("");
            await page.postForm.textTextbox.acceptText(""); // this is the way for title to loose focus and trigger validation
            expect(await page.submitButton.isDisabled()).toBe(false); // UX do not like disabled buttons
            expect(await page.titleTextboxFormField.getErrors()).toEqual(["Title is required"]);
            await page.titleTextbox.acceptText("42");
            expect(await page.titleTextboxFormField.getErrors()).toEqual(["Please specify at least 10 characters"]);
            await page.postForm.textTextbox.acceptText("");
            await page.postForm.authorTextbox.acceptText("");
            await page.postForm.textTextbox.acceptText(""); // this is the way for title to loose focus and trigger validation
            expect(await page.postForm.textFormField.getErrors()).toEqual(["Problem description is required"]);
            expect(await page.postForm.authorFormField.getErrors()).toEqual(["Please specify author name"]);
        });

        it("should post the valid form and go to question list page", async () => {
            await page.titleTextbox.acceptText("Question title");
            await page.postForm.textTextbox.acceptText("Question text");
            await page.postForm.authorTextbox.acceptText("Question author");
            await page.submitButton.click();
            await Helper.waitForUrl("questions");

            const listPage = new QuestionListPage();
            expect(await listPage.repeat.getElement().isDisplayed()).toBe(true);
            // TODO: Check that item is in the list
        });

        it("should navigate to question list page on cancel click", async () => {
            await page.cancelButton.click();
            await Helper.waitForUrl("questions");

            const listPage = new QuestionListPage();
            expect(await listPage.repeat.getElement().isPresent()).toBe(true);
        });

    });


});
