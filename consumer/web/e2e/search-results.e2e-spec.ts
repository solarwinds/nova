import { browser } from "protractor";

import { Helper } from "./helper";
import { AppPage } from "./page-objects/app.po";
import { QuestionListPage } from "./page-objects/question-list.po";
import { SearchResultsPage } from "./page-objects/search-results.po";
import { QuestionWorkflow } from "./workflows/question-workflow";

describe("Search >", () => {
    const appPage: AppPage = new AppPage();
    const questionListPage = new QuestionListPage();
    const page: SearchResultsPage = new SearchResultsPage();

    const createQuestionInputs = [
        {
            title: "question fizz",
            text: "question fizztext",
            author: "question author",
        },
        {
            title: "question buzz",
            text: "question buzztext",
            author: "question author",
        },
        {
            title: "question fizzbuzz",
            text: "question fizzbuzztext",
            author: "question author",
        }];

    beforeAll(async () => {
        await browser.waitForAngularEnabled(true);

        for (const q of createQuestionInputs) {
            await QuestionWorkflow.createQuestion(q);
        }
    }, Helper.WORKFLOW_TIMEOUT);

    afterAll(async () => {
        await QuestionWorkflow.deleteAllQuestions();
    }, Helper.WORKFLOW_TIMEOUT);

    beforeEach(async () => {
        await questionListPage.navigateTo();
    });

    describe("Initial state >", () => {

        it("questions were created sucessfully", async () => {
            expect(await questionListPage.repeat.itemCount()).toBe(3);
        });

    });

    describe("Search >", () => {

        async function checkTitles(expectedTitles: string[]) {
            for (let i = 0; i < expectedTitles.length; i++) {
                const item = await page.getQuestionItem(i);
                expect(await item.getTitle()).toEqual(expectedTitles[i]);
            }
        }

        it("fizz and fizzbuzz is found", async () => {
            await appPage.search("fizz");

            expect(await page.questionList.itemCount()).toBe(2);

            await checkTitles(["question fizz", "question fizzbuzz"]);
        });

        it("buzz and fizzbuzz is found", async () => {
            await appPage.search("buzz");

            expect(await page.questionList.itemCount()).toBe(2);

            await checkTitles(["question buzz", "question fizzbuzz"]);
        });

        it("only fizzbuzz is found", async () => {
            await appPage.search("fizzbuzz");

            expect(await page.questionList.itemCount()).toBe(1);

            await checkTitles(["question fizzbuzz"]);
        });
    });
});
