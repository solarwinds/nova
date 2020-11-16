import { browser } from "protractor";

import { IAddQuestionInput } from "../src/app/types";

import { Helper } from "./helper";
import { AppPage } from "./page-objects/app.po";
import { QuestionDetailsPage } from "./page-objects/question-details.po";
import { QuestionListItemAtom, QuestionListPage } from "./page-objects/question-list.po";
import { QuestionWorkflow } from "./workflows/question-workflow";

describe("Question List >", () => {
    let page: QuestionListPage;
    let details: QuestionDetailsPage;
    const appPage = new AppPage();

    const answers = [
        {text: "answer text", author: "answer author"},
        {text: "second answer text", author: "second answer author"},
        {text: "third answer text", author: "third answer author"},
        {text: "4-th answer text", author: "4-th answer author"},
    ];

    const validUser = { username: "joe", password: "x"};

    beforeAll(async () => {
        page = new QuestionListPage();
        details = new QuestionDetailsPage();

        await appPage.navigateTo();
        await appPage.logIn(validUser.username, validUser.password);
        await Helper.waitForUrl("/questions");
    }, Helper.WORKFLOW_TIMEOUT);

    afterAll(async () => {
        await appPage.logOut();
    }, Helper.WORKFLOW_TIMEOUT);

    describe("Initial state >", () => {

        beforeAll(async () => {
            await page.navigateTo();
        });

        describe("No Items >", () => {
            it("should display an 'empty' placeholder present on the page when no questions created", async () => {
                expect(await page.emptyList.getElement().isPresent()).toEqual(true);
            });

            it("should have no list present on the page when no questions created", async () => {
                expect(await page.repeat.getItems().isPresent()).toBeFalsy();
            });

            it("should not display the sorter on the page when no questions created", async () => {
                expect(await page.sorter.getElement().isDisplayed()).toEqual(false);
            });

            it("should not display the paginator when no questions created", async () => {
                expect(await page.paginator.getElement().isDisplayed()).toEqual(false);
            });

        });

    });

    describe("Scenarios >", () => {
        // ToDo: Get this from paginator. Needs atom improvement
        const itemsPerPage = 10;

        afterAll(async () => {
            await QuestionWorkflow.deleteAllQuestions();
        }, Helper.WORKFLOW_TIMEOUT * (itemsPerPage + 1));

        function generateQuestionInput(index: number): IAddQuestionInput {
            return <IAddQuestionInput>{
                title: index === 2 ? "Second question list test title" : `Question list test title ${index}`,
                text: "*Question list* test text",
                author: "test author",
            };
        }

        describe("After 1 Question Created >", () => {
            const firstQuestion = generateQuestionInput(1);
            beforeAll(async () => {
                await QuestionWorkflow.createQuestion(firstQuestion);
            });

            describe("Item template >", () => {
                let listItem: QuestionListItemAtom;
                beforeAll(async () => {
                    listItem = await page.getQuestionItem(0);
                });

                it("should have correct title", async () => {
                    expect(await listItem.getTitle()).toEqual(firstQuestion.title);
                });

                it("should have the correct author", async () => {
                    expect(await listItem.author.getText()).toEqual(firstQuestion.author);
                });

                it("should initially display an answer count of zero", async () => {
                    expect(await listItem.getAnswerCount()).toEqual(0);
                });

                it("should initially display a vote count of zero", async () => {
                    expect(await listItem.getVoteCount()).toEqual(0);
                });

                it("should navigate to the question details page", async () => {
                    await listItem.openDetail();
                    expect(await details.answerForm.getElement().isDisplayed()).toEqual(true);
                    await page.navigateTo();
                });

                it("should display the correct number of answers after one is added", async () => {
                    await listItem.openDetail();
                    await details.addAnswer(answers[0].text, answers[0].author);
                    await page.navigateTo();
                    await page.waitForItemsToBePresent();

                    expect(await listItem.getAnswerCount()).toEqual(1);
                    expect(await listItem.hasAcceptedAnswer()).toEqual(false);
                });

                it("should display the correct number of votes after a vote is registered", async () => {
                    await listItem.openDetail();
                    await details.clickQuestionUpVote();
                    await page.navigateTo();
                    await page.waitForItemsToBePresent();
                    
                    expect(await listItem.getVoteCount()).toEqual(1);
                });

                it("should mark the question as answered when accepting an answer", async () => {
                    await listItem.openDetail();
                    await details.addAnswer(answers[1].text, answers[1].author);
                    await (await details.getAnswer(0)).markAccepted();
                    await page.navigateTo();
                    await page.waitForItemsToBePresent();

                    expect(await listItem.getAnswerCount()).toEqual(2);
                    expect(await listItem.hasAcceptedAnswer()).toEqual(true);
                });
            });

            describe("paginator >", () => {

                it("should be displayed", async () => {
                    expect(await page.paginator.getElement().isDisplayed()).toEqual(true);
                });

                it("should show correct total", async () => {
                    expect(await page.paginator.getTotal()).toEqual(1);
                });

                it("should have 'next' and 'prev' buttons disabled", async () => {
                    expect(await page.paginator.nextLink().isEnabled()).toEqual(false);
                    expect(await page.paginator.prevLink().isEnabled()).toEqual(false);
                });

                // TODO: add implementation after NUI-1843
                xit("should show correct 'items per page' value", async () => {
                    // expect(await page.paginator.getItemsPerPage()).toEqual(itemsPerPage);
                });

            });

            describe("sorter >", () => {

                it("should be displayed", async () => {
                    expect(await page.sorter.getElement().isDisplayed()).toEqual(true);
                });

            });

            it("should hide empty component", async () => {
                expect(await page.emptyList.getElement().isPresent()).toEqual(false);
            });

        });

        describe(`After ${itemsPerPage} More Questions Created >`, () => {

            beforeAll(async () => {
                let i;
                for (i = 2; i < 2 + itemsPerPage; i++) {
                    await QuestionWorkflow.createQuestion(generateQuestionInput(i));
                }
            }, Helper.WORKFLOW_TIMEOUT * itemsPerPage);

            it(`should display ${itemsPerPage} items`, async () => {
                expect(await page.repeat.itemCount()).toEqual(itemsPerPage);
            });

            it(`should have item #${itemsPerPage} on the page`, async () => {
                const mockItem = generateQuestionInput(itemsPerPage);
                expect(await page.getQuestionIndexByTitle(mockItem.title)).toEqual(itemsPerPage - 1);
            });

            it(`should not have item #${itemsPerPage + 1} on the page`, async () => {
                const mockItem = generateQuestionInput(itemsPerPage + 1);
                expect(await page.getQuestionIndexByTitle(mockItem.title)).toEqual(-1);
            });

            describe("paginator >", () => {

                it("should display correct total", async () => {
                    expect(await page.paginator.getTotal()).toEqual(1 + itemsPerPage);
                });

                it("should have only 'next' button enabled", async () => {
                    expect(await page.paginator.nextLink().isEnabled()).toEqual(true);
                    expect(await page.paginator.prevLink().isEnabled()).toEqual(false);
                });

                it("should display correct number of pages", async () => {
                    expect(await page.paginator.pageCount()).toEqual(2);
                });

            });

            describe("sorter >", () => {

                it("should sort by 'date' by default", async () => {
                    const firstTitle = generateQuestionInput(1).title;
                    const lastTitle = generateQuestionInput(itemsPerPage).title;
                    expect(await page.sorter.getCurrentValue()).toEqual("date");
                    expect(await page.getQuestionIndexByTitle(firstTitle)).toEqual(0);
                    expect(await page.getQuestionIndexByTitle(lastTitle)).toEqual(itemsPerPage - 1);
                });

                it("should should have 'original' sorting order by default", async () => {
                    expect(await page.sorter.getSorterButton().getIcon()).toBeFalsy();
                });

                it("should be able to sort in reverse order", async () => {
                    await page.sorter.getSorterButton().click(); // ASC order
                    await page.sorter.getSorterButton().click(); // DESC order

                    const firstTitle = generateQuestionInput(itemsPerPage + 1).title;
                    const lastTitle = generateQuestionInput(2).title; // first item should go to the other page

                    expect(await page.getQuestionIndexByTitle(firstTitle)).toEqual(0);
                    expect(await page.getQuestionIndexByTitle(lastTitle)).toEqual(itemsPerPage - 1);
                });

                it("should be able to sort by 'title'", async () => {
                    const secondTitle = generateQuestionInput(2).title;
                    await page.sorter.select("title");
                    expect(await page.sorter.getCurrentValue()).toEqual("title");
                    expect(await page.getQuestionIndexByTitle(secondTitle)).toEqual(0);
                });

            });

        });

        describe(`After Going to next page >`, () => {

            beforeAll(async () => {
                await page.navigateTo();
                await page.paginator.nextLink().click();
            });

            it("should display just one last item", async () => {
                const mockItem = generateQuestionInput(itemsPerPage + 1);
                expect(await page.repeat.itemCount()).toEqual(1);
                expect(await page.getQuestionIndexByTitle(mockItem.title)).toEqual(0);
            });

            describe("paginator >", () => {

                it("should display correct current page", async () => {
                    expect(await page.paginator.activePage()).toEqual(2);
                });

                it("should have only 'prev' button enabled", async () => {
                    expect(await page.paginator.nextLink().isEnabled()).toEqual(false);
                    expect(await page.paginator.prevLink().isEnabled()).toEqual(true);
                });

            });

        });

    });
});
