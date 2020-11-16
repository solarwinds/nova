import { Atom, DialogAtom } from "@solarwinds/nova-bits/sdk/atoms";
import _includes from "lodash/includes";
import _some from "lodash/some";

import { by, element, Key } from "protractor";

import { AnswerAtom } from "./atoms/components/answer.atom";
import { Helper } from "./helper";
import { AppPage } from "./page-objects/app.po";
import { ICreateQuestionInput } from "./page-objects/create-question.po";
import { QuestionDetailsPage } from "./page-objects/question-details.po";
import { QuestionWorkflow } from "./workflows/question-workflow";

describe("Question Detail >", () => {
    let page: QuestionDetailsPage;
    let questionDetailUrl: string;
    const createQuestionInput: ICreateQuestionInput = {
        title: "question detail test title",
        text: "*question detail* test text",
        author: "question detail test author",
    };
    const questionTextHtml = "<p><em>question detail</em> test text</p>";
    const questionTextStripped = "question detail test text";
    const answers = [
        {text: "answer text", author: "answer author"},
        {text: "second answer text", author: "second answer author"},
        {text: "third answer text", author: "third answer author"},
        {text: "4-th answer text", author: "4-th answer author"},
    ];
    const reachAnswer = {text: "> This is `markdown` formatted __answer__", author: "reach answer author"};
    const answerTextHtml = `<blockquote>
  <p>This is <code>markdown</code> formatted <strong>answer</strong></p>
</blockquote>`;
    const answerTextStripped = "This is markdown formatted answer";

    beforeAll(async () => {
        page = new QuestionDetailsPage();
        questionDetailUrl = await QuestionWorkflow.createQuestionAndViewDetail(createQuestionInput);
    }, Helper.WORKFLOW_TIMEOUT);

    afterAll(async () => {
        await QuestionWorkflow.deleteAllQuestions();
    }, Helper.WORKFLOW_TIMEOUT);

    describe("Initial State >", () => {
        beforeAll(async () => {
            await page.navigateTo(questionDetailUrl);
        });

        it("should display question title", async () => {
            expect(await page.questionTitle.getText()).toEqual(createQuestionInput.title);
        });

        it("should display qestion text", async () => {
            expect(await page.questionPost.getText()).toEqual(questionTextStripped);
        });

        it("should convert markdown to html in question text", async () => {
            expect(await page.questionPost.getTextHtml()).toEqual(questionTextHtml);
        });

        it("should have link to edit question", async () => {
            expect(await page.editLink.isDisplayed()).toEqual(true);
        });

        it("should have link to delete question", async () => {
            expect(await page.deleteLink.isDisplayed()).toEqual(true);
        });

        it("should not contain any answers", async () => {
            expect(await page.getNumberOfAnswers()).toBe(0);
        });

        it("should display answer form", async () => {
            expect(await page.isAnswerFormPresent()).toEqual(true);
        });

        describe("Edit Question Form >", () => {
            beforeAll(async () => {
                await page.editLink.click();
            });

            it("should replace the question", async () => {
                expect(await page.questionTitle.isPresent()).toEqual(false);
                expect(await page.questionPost.getElement().isPresent()).toEqual(false);
                expect(await page.questionForm.getElement().isPresent()).toEqual(true);
            });

            it("should display fields for editing title and text with proper values set", async () => {
                expect(await page.questionForm.titleTextbox.getValue()).toEqual(createQuestionInput.title);
                expect(await page.questionForm.textTextbox.getValue()).toEqual(createQuestionInput.text);
            });

            it("should display text preview converted to html", async () => {
                expect(await page.questionForm.getTextPreviewHtml()).toEqual(questionTextHtml);
            });

            it("should have 'Update' and 'Cancel' buttons", async () => {
                expect(await page.questionForm.updateButton.isVisible()).toEqual(true);
                expect(await page.questionForm.cancelButton.isVisible()).toEqual(true);
            });

            describe("Validation >", () => {
                it("should fail when title field is empty", async () => {
                    await page.questionForm.titleTextbox.clearText();
                    await page.questionForm.titleTextbox.acceptText(Key.TAB);
                    const errors = await page.questionForm.titleFormField.getErrors();
                    expect(errors.length).toBeGreaterThan(0);
                    expect(_some(errors, (e) => _includes(e, "required"))).toEqual(true);
                });

                it("should fail when text field is empty", async () => {
                    await page.questionForm.textTextbox.clearText();
                    await page.questionForm.titleTextbox.acceptText(Key.TAB);
                    const errors = await page.questionForm.textFormField.getErrors();
                    expect(errors.length).toBeGreaterThan(0);
                    expect(_some(errors, (e) => _includes(e, "required"))).toEqual(true);
                });

                it("should fail when title field has less then 10 characters", async () => {
                    await page.questionForm.titleTextbox.clearText();
                    await page.questionForm.titleTextbox.acceptText("123456789");
                    await page.questionForm.titleTextbox.acceptText(Key.TAB);
                    const errors = await page.questionForm.titleFormField.getErrors();
                    expect(errors.length).toBeGreaterThan(0);
                    expect(_some(errors, (e) => _includes(e, "10 characters"))).toEqual(true);
                });

                it("should pass when title field has more then 10 characters", async () => {
                    await page.questionForm.titleTextbox.clearText();
                    await page.questionForm.titleTextbox.acceptText("1234567890");
                    await page.questionForm.titleTextbox.acceptText(Key.TAB);
                    const errors = await page.questionForm.titleFormField.getErrors();
                    expect(errors.length).toEqual(0);
                });

            });

        });

        describe("Add Answer Form >", () => {

            it("should display emty fields for text and author", async () => {
                expect(await page.answerForm.textTextbox.getValue()).toEqual("");
                expect(await page.answerForm.authorTextbox.getValue()).toEqual("");
            });

            it("should display text preview converted to html", async () => {
                await page.answerForm.textTextbox.acceptText(createQuestionInput.text);
                expect(await page.answerForm.getTextPreviewHtml()).toEqual(questionTextHtml);
            });

            it("should have 'Answer question' buttons", async () => {
                expect(await page.answerSubmitButton.isVisible()).toEqual(true);
            });

            describe("Validation >", () => {
                it("should fail when text field is empty", async () => {
                    await page.answerForm.textTextbox.clearText();
                    await page.answerForm.textTextbox.acceptText(Key.TAB);
                    const errors = await page.answerForm.textFormField.getErrors();
                    expect(errors.length).toBeGreaterThan(0);
                    expect(_some(errors, (e) => _includes(e, "required"))).toEqual(true);
                });

                it("should fail when author field is empty", async () => {
                    await page.answerForm.authorTextbox.clearText();
                    await page.answerForm.authorTextbox.acceptText(Key.TAB);
                    const errors = await page.answerForm.authorFormField.getErrors();
                    expect(errors.length).toBeGreaterThan(0);
                    expect(_some(errors, (e) => _includes(e, "Please specify author name"))).toEqual(true);
                });

            });

        });

    });

    describe("Question Update >", () => {
        const suffix = " new";

        beforeEach(async () => {
            await page.navigateTo(questionDetailUrl);
            await page.editLink.click();

            await page.questionForm.titleTextbox.acceptText(suffix);
            await page.questionForm.textTextbox.acceptText(suffix);
        });

        it("should display question without changes on cancel", async () => {
            await page.questionForm.cancelButton.click();

            // Edit mode is off
            expect(await page.questionTitle.isPresent()).toEqual(true);
            expect(await page.questionPost.getElement().isPresent()).toEqual(true);
            expect(await page.questionForm.getElement().isPresent()).toEqual(false);

            // Changes were rejected
            expect(await page.questionTitle.getText()).toEqual(createQuestionInput.title);
            expect(await page.questionPost.getText()).toEqual(questionTextStripped);
        });

        xit("should trigger submit on hitting ENTER", async () => {
            await page.questionForm.titleTextbox.acceptText(Key.ENTER);

            // Edit mode is off
            expect(await page.questionTitle.isPresent()).toEqual(true);
            expect(await page.questionPost.getElement().isPresent()).toEqual(true);
            expect(await page.questionForm.getElement().isPresent()).toEqual(false);

            // Changes were applied
            expect(await page.questionTitle.getText()).toEqual(createQuestionInput.title + suffix);
            expect(await page.questionPost.getText()).toEqual(questionTextStripped + suffix);
        });

    });

    describe("Scenarios >", () => {
        const validUser = { username: "joe", password: "x" };
        const appPage = new AppPage();

        beforeAll(async () => {
            await appPage.navigateTo();
            await appPage.logIn(validUser.username, validUser.password);
            await Helper.waitForUrl("/questions");
        });

        afterAll(async () => {
            await appPage.logOut();
        });

        describe("Answer CRUD >", () => {

            beforeAll(async () => {
                await page.navigateTo(questionDetailUrl);
            });

            afterAll(async () => {
                await page.deleteAllAnswers();
            });

            it("should be able to add an answer", async () => {
                await page.addAnswer(answers[0].text, answers[0].author);

                expect(await page.getNumberOfAnswers()).toBe(1);

                const answer = await page.getAnswer(0);

                expect(await answer.post.getText()).toEqual(answers[0].text);
                expect(await answer.post.getAuthor()).toEqual(answers[0].author);

                // Form should be cleared without errors
                expect(await page.answerForm.textTextbox.getValue()).toEqual("");
                expect(await page.answerForm.authorTextbox.getValue()).toEqual("");

                // Should be fixed under NUI-1804
                // Form should show no errors
                // expect(await page.answerForm.textFormField.getErrors()).toEqual([]);
                // expect(await page.answerForm.authorFormField.getErrors()).toEqual([]);

            });

            it("should be able to update an answer", async () => {
                const updatedText = "updated answer text";
                await page.updateAnswer(0, updatedText);

                const answer = await page.getAnswer(0);

                expect(await answer.post.getText()).toEqual(updatedText);
                expect(await answer.post.isUpdatedDatePresent()).toBe(true);
            });

            it("should not delete an answer when dialog is dismissed", async () => {
                const answer = await page.getAnswer(0);
                await answer.deleteLink.click();

                const dialog = await Atom.findIn(DialogAtom, element(by.tagName("body")));
                await dialog.getCancelButton().click();

                expect(await page.getNumberOfAnswers()).toBe(1);
            });

            it("should be able to delete an answer", async () => {
                const answer = await page.getAnswer(0);

                await answer.delete();

                expect(await page.getNumberOfAnswers()).toBe(0);
            });

        });

        describe("Accepted Answer >", () => {
            const answerIndexToAccept = 1;
            beforeAll(async () => {
                await page.navigateTo(questionDetailUrl);
                for (const answer of answers) {
                    await page.addAnswer(answer.text, answer.author);
                }
            });

            afterAll(async () => {
                await page.deleteAllAnswers();
            });

            describe("Before Any Answer Was Accepted >", () => {

                it("should be possible to mark any answer as accepted", async () => {
                    expect(await page.getNumberOfAnswers()).toBe(answers.length);
                    expect(await page.isWaitingForAcceptedAnswerSelection()).toEqual(true);
                });

                it("should display answers in creation order", async () => {
                    const answer0 = await page.getAnswer(0);
                    const answer3 = await page.getAnswer(3);
                    expect(await answer0.post.getText()).toEqual(answers[0].text);
                    expect(await answer3.post.getText()).toEqual(answers[3].text);
                });
            });

            describe(`After Accepting an Answer #${answerIndexToAccept + 1} >`, () => {
                const acceptedAnswerText = answers[answerIndexToAccept].text;
                beforeAll(async () => {
                    await page.selectAcceptedAnswer(acceptedAnswerText);
                });

                it("should mark an answer as 'accepted'", async () => {
                    expect(await page.isAnswerMarkedAsAccepted(acceptedAnswerText)).toEqual(true);
                });

                it("should pin accepted answer to the top of the list", async () => {
                    expect(await page.getAnswerPosition(acceptedAnswerText)).toEqual(0);
                });

                it("should not be possible to accept another answer", async () => {
                    const nextAnswerText = answers[answerIndexToAccept + 1].text;
                    await page.selectAcceptedAnswer(nextAnswerText);
                    expect(await page.isAnswerMarkedAsAccepted(nextAnswerText)).toEqual(false);
                    expect(await page.isAnswerMarkedAsAccepted(acceptedAnswerText)).toEqual(true);
                });

            });

            describe("After Deselecting  of the 'Accepted Answer' >", () => {
                beforeAll(async () => {
                    await page.deselectAcceptedAnswer();
                });

                it("should be possible to mark any answer as accepted", async () => {
                    expect(await page.isWaitingForAcceptedAnswerSelection()).toEqual(true);
                });

                it("should display answers in creation order", async () => {
                    expect(await page.getAnswerPosition(answers[0].text)).toEqual(0);
                    expect(await page.getAnswerPosition(answers[3].text)).toEqual(3);
                });

            });

        });

        describe("Voting On Question >", () => {
            describe("Before Question Was Voted >", () => {
                it("should be possible to vote on the question", async () => {
                    expect(await page.isWaitingForQuestionVote()).toEqual(true);
                    expect(await page.getQuestionVoteCount()).toEqual(0);
                });
            });

            describe(`After Up Voting Question >`, () => {
                it("should upvote the question", async () => {
                    await page.clickQuestionUpVote();
                    expect(await page.getQuestionVoteCount()).toEqual(1);
                });
                it("should undo the vote", async () => {
                    await page.clickQuestionUpVote();
                    expect(await page.getQuestionVoteCount()).toEqual(0);
                });
            });

            describe("After Down Voting Question >", () => {
                it("should downvote the question", async () => {
                    await page.clickQuestionDownVote();
                    expect(await page.getQuestionVoteCount()).toEqual(-1);
                });

                it("should undo the vote", async () => {
                    await page.clickQuestionDownVote();
                    expect(await page.getQuestionVoteCount()).toEqual(0);
                });
            });

            describe("Same User Only Gets One Vote >", () => {
                it("should display correct vote count", async () => {
                    await page.clickQuestionDownVote();
                    expect(await page.getQuestionVoteCount()).toEqual(-1);
                    await page.clickQuestionUpVote();
                    expect(await page.getQuestionVoteCount()).toEqual(1);
                });
            });
        });

        describe("Voting On Answer >", () => {
            describe("Before Answer Was Voted >", () => {
                it("should be possible to vote on the answer", async () => {
                    await page.addAnswer("text text", "author text");

                    expect(await page.isWaitingForAnswerVote(0)).toEqual(true);
                    expect(await page.getAnswerVoteCount(0)).toEqual(0);
                });
            });

            describe(`After Up Voting Answer >`, () => {
                it("should upvote the answer", async () => {
                    await page.clickAnswerUpVote(0);
                    expect(await page.getAnswerVoteCount(0)).toEqual(1);
                });
                it("should undo the vote", async () => {
                    await page.clickAnswerUpVote(0);
                    expect(await page.getAnswerVoteCount(0)).toEqual(0);
                });
            });

            describe("After Down Voting Answer >", () => {
                it("should downvote the answer", async () => {
                    await page.clickAnswerDownVote(0);
                    expect(await page.getAnswerVoteCount(0)).toEqual(-1);
                });

                it("should undo the vote", async () => {
                    await page.clickAnswerDownVote(0);
                    expect(await page.getAnswerVoteCount(0)).toEqual(0);
                });
            });

            describe("Same User Only Gets One Vote >", () => {
                it("should display correct vote count", async () => {
                    await page.clickAnswerDownVote(0);
                    expect(await page.getAnswerVoteCount(0)).toEqual(-1);
                    await page.clickAnswerUpVote(0);
                    expect(await page.getAnswerVoteCount(0)).toEqual(1);
                    await page.clickAnswerUpVote(0);
                    expect(await page.getAnswerVoteCount(0)).toEqual(0);
                });
            });

            describe("Votes should stay with their answer when another answer is Accepted >", () => {
                it("should display correct vote count", async () => {
                    expect(await page.getAnswerVoteCount(0)).toEqual(0);
                    const acceptedAnswerText = "accepted answer text";
                    await page.clickAnswerDownVote(0);
                    expect(await page.getAnswerVoteCount(0)).toEqual(-1);
                    await page.addAnswer(acceptedAnswerText, "accepted answer author");
                    await page.selectAcceptedAnswer(acceptedAnswerText);
                    await page.clickAnswerUpVote(0);
                    expect(await page.getAnswerVoteCount(0)).toEqual(1);
                    expect(await page.getAnswerVoteCount(1)).toEqual(-1);
                });
            });
        });
    });

    describe("Answers >", () => {
        const validUser = { username: "joe", password: "x" };
        const appPage = new AppPage();
        let testAnswer: AnswerAtom;

        beforeAll(async () => {
            await appPage.navigateTo();
            await appPage.logIn(validUser.username, validUser.password);
            await Helper.waitForUrl("/questions");
            await page.navigateTo(questionDetailUrl);

            // Adding markdown formatted answer and pinning it to the top of the page
            await page.addAnswer(reachAnswer.text, reachAnswer.author);
            await page.deselectAcceptedAnswer();
            await page.selectAcceptedAnswer(reachAnswer.text);
            testAnswer = await page.getAnswer(0);
        });

        afterAll(async () => {
            await appPage.logOut();
        });

        describe("Template >", () => {
            it("should display answer text converted to html", async () => {
                expect(await testAnswer.post.getTextHtml()).toEqual(answerTextHtml);
            });

            it("should display creation time only", async () => {
                expect(await testAnswer.post.isCreationDatePresent()).toEqual(true);
                expect(await testAnswer.post.isUpdatedDatePresent()).toEqual(false);
            });

            it("should display the author correctly", async () => {
                expect(await testAnswer.post.getAuthor()).toEqual(reachAnswer.author);
            });

            it("should display edit and delete links", async () => {
                expect(await testAnswer.editLink.isDisplayed()).toEqual(true);
                expect(await testAnswer.deleteLink.isDisplayed()).toEqual(true);
            });

            it("should not display edit form", async () => {
                expect(await testAnswer.postForm.getElement().isPresent()).toEqual(false);
            });


        });

        describe("Edit Form >", () => {
            beforeAll(async () => {
                await testAnswer.editLink.click();
            });

            it("should replace the answer", async () => {
                expect(await testAnswer.isEditing()).toEqual(true);

                expect(await testAnswer.post.getElement().isPresent()).toEqual(false);
                expect(await testAnswer.editLink.isPresent()).toEqual(false);
                expect(await testAnswer.deleteLink.isPresent()).toEqual(false);
            });

            it("should display text field with proper value set", async () => {
                expect(await testAnswer.postForm.textTextbox.getValue()).toEqual(reachAnswer.text);
            });

            it("should display text preview converted to html", async () => {
                expect(await testAnswer.postForm.getTextPreviewHtml()).toEqual(answerTextHtml);
            });

            it("should have 'Save' and 'Cancel' buttons", async () => {
                expect(await testAnswer.saveButton.isVisible()).toEqual(true);
                expect(await testAnswer.cancelEditingButton.isVisible()).toEqual(true);
            });

            it("should fail the validation when text field is empty", async () => {
                await testAnswer.postForm.textTextbox.clearText();
                await testAnswer.postForm.textTextbox.acceptText(Key.TAB);

                const errors = await testAnswer.postForm.textFormField.getErrors();
                expect(errors.length).toBeGreaterThan(0);
                expect(_some(errors, (e) => _includes(e, "required"))).toEqual(true);
            });

            it("should display answer without changes on cancel", async () => {
                await testAnswer.cancelEditingButton.click();
                expect(await testAnswer.isEditing()).toEqual(false);
                expect(await testAnswer.post.getText()).toEqual(answerTextStripped);

                await testAnswer.editLink.click();
            });

        });

    });

});
