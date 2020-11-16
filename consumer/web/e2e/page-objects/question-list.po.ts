import { Atom, EmptyAtom, IconAtom, PaginatorAtom, RepeatAtom, SearchAtom, SorterAtom } from "@solarwinds/nova-bits/sdk/atoms";
import { browser, by, element, ElementFinder } from "protractor";

import { Helper } from "../helper";

import { QuestionDetailsPage } from "./question-details.po";

export class QuestionListItemAtom extends Atom {
    public static CSS_CLASS = "rd-question-list-item";

    public detailLink: ElementFinder;
    public author: ElementFinder;
    public creationDate: ElementFinder;
    public answerCount: ElementFinder;
    public voteCount: ElementFinder;
    public acceptedAnswerIcon: IconAtom;

    constructor(rootElement: ElementFinder) {
        super(rootElement);

        this.detailLink = rootElement.element(by.className("rd-question-list-item__detail-link"));
        this.author = rootElement.element(by.className("rd-question-list-item__author"));
        this.creationDate = rootElement.element(by.className("rd-question-list-item__creation-date"));
        this.answerCount = rootElement.element(by.className("rd-question-list-item__answer-count"));
        this.voteCount = rootElement.element(by.className("rd-question-list-item__vote-count"));
        this.acceptedAnswerIcon = Atom.findIn(IconAtom, rootElement.element(by.className("rd-question-list-item__accepted-answer-icon")));
    }

    public async openDetail(): Promise<void> {
        await this.detailLink.click();
        await Helper.waitForUrl("/question/");

        const questionDetailsPage = new QuestionDetailsPage();

        await browser.wait(async () => await questionDetailsPage.answerForm.getElement().isPresent(), Helper.BROWSER_WAIT_TIMEOUT);
    }

    public async getTitle(): Promise<string> {
        return this.detailLink.getText();
    }

    public async getAnswerCount(): Promise<number> {
        return Number.parseInt(await this.answerCount.getText());
    }

    public async getVoteCount(): Promise<number> {
        return Number.parseInt(await this.voteCount.getText());
    }

    public async hasAcceptedAnswer(): Promise<boolean> {
        return await this.acceptedAnswerIcon.getName() === "status_up";
    }
}

export class QuestionListPage {
    private questionList: RepeatAtom;
    private questionListPaginator: PaginatorAtom;
    private questionListSorter: SorterAtom;
    private questionListEmpty: EmptyAtom;
    private listContainer: ElementFinder;

    constructor() {
        this.listContainer = element(by.className("rd-question-list__list"));
    }

    public get repeat() {
        this.questionList = Atom.findIn(RepeatAtom, this.listContainer);
        return this.questionList;
    }

    public get paginator() {
        this.questionListPaginator = Atom.findIn(PaginatorAtom, this.listContainer);
        return this.questionListPaginator;
    }

    public get sorter() {
        this.questionListSorter = Atom.findIn(SorterAtom, this.listContainer);
        return this.questionListSorter;
    }

    public get emptyList() {
        this.questionListEmpty = Atom.findIn(EmptyAtom, this.listContainer);
        return this.questionListEmpty;
    }

    public async navigateTo(): Promise<void> {
        return browser.get("/questions");
    }

    public async waitForItemsToBePresent(): Promise<boolean> {
        return browser.wait(async () => await this.areItemsPresent(), Helper.WORKFLOW_TIMEOUT);
    }

    public async areItemsPresent(): Promise<boolean> {
        return this.repeat.getItems().get(0).isPresent();
    }

    public async deleteAllQuestions(): Promise<void> {
        const questionDetailsPage = new QuestionDetailsPage();

        while (await this.repeat.itemCount() > 0) {
            const question = Atom.findIn(QuestionListItemAtom, this.repeat.getItem(0));
            await question.openDetail();
            await Helper.waitForUrl("/question/");
            await questionDetailsPage.deleteQuestion();
            await browser.sleep(500);
        }
    }

    public async getQuestionIndexByTitle(title: string): Promise<number> {
        const items: QuestionListItemAtom[] = [];
        const itemElements = this.repeat.getItems();
        await itemElements.each(itemElement => items.push(Atom.findIn(QuestionListItemAtom, itemElement)));

        for (let i = 0; i < items.length; i++) {
            const itemTitle = await items[i].getTitle();
            if (itemTitle === title) {
                return i;
            }
        }

        return -1;
    }

    public async getQuestionItemByTitle(title: string): Promise<QuestionListItemAtom> {
        const firstMatchIndex = await this.getQuestionIndexByTitle(title);

        if (firstMatchIndex === -1) {
            throw new Error("No matching question found for title: " + title);
        }

        return this.getQuestionItem(firstMatchIndex);
    }

    public async getQuestionItem(index: number): Promise<QuestionListItemAtom> {
        const questionElement = await this.repeat.getItem(index);

        return Atom.findIn(QuestionListItemAtom, questionElement);
    }
}
