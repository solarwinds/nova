import { Atom, ButtonAtom, DialogAtom } from "@solarwinds/nova-bits/sdk/atoms";
import { browser, by, element, ElementArrayFinder, ElementFinder } from "protractor";

import { AnswerAtom } from "../atoms/components/answer.atom";
import { PostFormAtom } from "../atoms/components/post-form.atom";
import { PostAtom } from "../atoms/components/post.atom";
import { QuestionFormAtom } from "../atoms/components/question-form.atom";
import { Helper } from "../helper";

export class QuestionDetailsPage {
    public questionTitle: ElementFinder;
    public questionPost: PostAtom;
    public questionForm: QuestionFormAtom;
    public deleteLink: ElementFinder;
    public editLink: ElementFinder;
    private answers: ElementArrayFinder;
    public answerSubmitButton: ButtonAtom;
    public answerForm: PostFormAtom;
    private questionUpVoteButton: ButtonAtom;
    private questionDownVoteButton: ButtonAtom;
    public questionVoteCount: ElementFinder;

    constructor() {
        this.questionTitle = element(by.className("rd-question-detail__question-title"));
        this.questionPost = Atom.findIn(PostAtom, element(by.className("rd-question-detail__question-post")));
        this.questionForm = Atom.findIn(QuestionFormAtom, element(by.className("rd-question-form")));
        this.deleteLink = element(by.className("rd-question-detail__delete"));
        this.editLink = element(by.className("rd-question-detail__edit"));
        this.answers = element.all(by.className("rd-question-detail__answer"));
        this.answerForm = Atom.findIn(PostFormAtom, element(by.className("rd-question-detail__answer-form")));
        this.answerSubmitButton = Atom.findIn(ButtonAtom, element(by.className("rd-question-detail__answer-submit")));
        this.questionUpVoteButton = Atom.findIn(ButtonAtom, element(by.className("rd-question-detail__question-up-vote-button")));
        this.questionDownVoteButton = Atom.findIn(ButtonAtom, element(by.className("rd-question-detail__question-down-vote-button")));
        this.questionVoteCount = element(by.className("rd-question-detail__question-vote-count"));
    }

    public async navigateTo(url: string): Promise<void> {
        await browser.get(url);
        await browser.wait(async () => await this.answerForm.getElement().isPresent(), Helper.BROWSER_WAIT_TIMEOUT);
    }

    public async deleteQuestion(): Promise<void> {
        await browser.wait(browser.ExpectedConditions.presenceOf(this.deleteLink));

        await this.deleteLink.click();

        const dialog = Atom.findIn(DialogAtom, element(by.tagName("body")));
        await dialog.getActionButton().click();

        await Helper.waitForUrl("/questions");
    }

    public getAnswer = async (index: number): Promise<AnswerAtom> =>
        Atom.findIn(AnswerAtom, this.answers.get(index))

    public getNumberOfAnswers = async (): Promise<number> =>
        this.answers.count()

    public async addAnswer(text: string, author: string): Promise<boolean> {
        const originalNumberOfAnswers = await this.getNumberOfAnswers();

        await this.answerForm.textTextbox.acceptText(text);
        await this.answerForm.authorTextbox.acceptText(author);
        await this.answerSubmitButton.click();

        return browser.wait(async () => await this.getNumberOfAnswers() === originalNumberOfAnswers + 1, Helper.BROWSER_WAIT_TIMEOUT);
    }

    public async updateAnswer(answerIndex: number, updatedText: string): Promise<void> {
        const answer = await this.getAnswer(answerIndex);
        return answer.update(updatedText);
    }

    public async isAnswerFormPresent(): Promise<boolean> {
        return await this.answerForm.getElement().isPresent() && await this.answerSubmitButton.getElement().isPresent();
    }

    public async isWaitingForQuestionVote(): Promise<boolean> {
        return (await this.questionUpVoteButton.getElement().isPresent() &&
            await this.questionDownVoteButton.getElement().isPresent() &&
            await this.getQuestionVoteCount() === 0);
    }

    public async isWaitingForAnswerVote(answerIndex: number): Promise<boolean> {
        const answer = await this.getAnswer(answerIndex);
        return (await answer.upVoteButton.getElement().isPresent() &&
            await answer.downVoteButton.getElement().isPresent() &&
            await this.getAnswerVoteCount(answerIndex) === 0);
    }

    public async clickQuestionUpVote(): Promise<boolean> {
        const voteCount = await this.getQuestionVoteCount();
        await this.questionUpVoteButton.click();
        return browser.wait(async () => await this.getQuestionVoteCount() !== voteCount, Helper.BROWSER_WAIT_TIMEOUT);
    }

    public async clickQuestionDownVote(): Promise<boolean> {
        const voteCount = await this.getQuestionVoteCount();
        await this.questionDownVoteButton.click();
        return browser.wait(async () => await this.getQuestionVoteCount() !== voteCount, Helper.BROWSER_WAIT_TIMEOUT);
    }

    public async clickAnswerUpVote(answerIndex: number): Promise<boolean> {
        const answer = await this.getAnswer(answerIndex);
        return answer.clickUpVote();
    }

    public async clickAnswerDownVote(answerIndex: number): Promise<boolean> {
        const answer = await this.getAnswer(answerIndex);
        return answer.clickDownVote();
    }

    public async getQuestionVoteCount(): Promise<number> {
        return await Number.parseInt(await this.questionVoteCount.getText());
    }

    public async getAnswerVoteCount(answerIndex: number): Promise<number> {
        const answer = await this.getAnswer(answerIndex);
        return await Number.parseInt(await answer.voteCount.getText());
    }

    public async selectAcceptedAnswer(text: string): Promise<void> {
        const answerIndex = await this.getAnswerPosition(text);
        const answer = await this.getAnswer(answerIndex);
        return answer.markAccepted();
    }

    public async deselectAcceptedAnswer(): Promise<void> {
       const answer = await this.getAnswer(0);
       const text = await this.answers.text;
       return answer.unmarkAccepted();
    }

    public async isAnswerMarkedAsAccepted(answerText: string): Promise<boolean> {
        const answersCount = await this.getNumberOfAnswers();
        if (answersCount === 0) { return false; }

        // accepted answer must be in zeroth position
        const firstAnswer = await this.getAnswer(0);
        if ((await firstAnswer.post.getText()) !== answerText
            || !(await firstAnswer.isMarkedAsAccepted()) ) { return false; }

        // other answers should be disabled for acceptance
        for (let i = 1; i < answersCount; i++) {
            const answer = await this.getAnswer(i);
            if (!(await answer.isAcceptanceDisabled())) { return false; }
        }

        return true;
    }

    public async isWaitingForAcceptedAnswerSelection(): Promise<boolean> {
        let isWaitingForAcceptedAnswer = true;
        await this.answers.each(async (answer, index) => {
            if (isWaitingForAcceptedAnswer) {
                const answerAtom = await this.getAnswer(index);
                isWaitingForAcceptedAnswer = await answerAtom.isWaitingForAcceptance();
            }
        });

        return isWaitingForAcceptedAnswer;
    }

    public async getAnswerPosition(answerText: string): Promise<number> {
        let answerPosition = -1;
        await this.answers.each(async (answer, index) => {
            const text = await (await this.getAnswer(index)).post.getText();
            if (text === answerText) {
                answerPosition = index;
            }
        });
        return answerPosition;
    }

    public async deleteAllAnswers(): Promise<void> {
        for (let answerCount = await this.getNumberOfAnswers(); answerCount > 0; --answerCount) {
            await (await this.getAnswer(answerCount - 1)).delete();
        }
    }
}
