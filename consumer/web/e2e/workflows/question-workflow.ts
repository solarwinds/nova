import { browser } from "protractor";

import { Helper } from "../helper";
import { CreateQuestionPage, ICreateQuestionInput } from "../page-objects/create-question.po";
import { QuestionListPage } from "../page-objects/question-list.po";

export class QuestionWorkflow {
    /**
     * Creates a question
     *
     * @param input
     * @returns A promise with the created question's ListItemAtom
     */
    public static async createQuestion(input: ICreateQuestionInput): Promise<void> {
        const createQuestionPage = new CreateQuestionPage();
        await createQuestionPage.navigateTo();

        await createQuestionPage.createQuestion(input);

        await Helper.waitForUrl("/questions");
    }

    /**
     * Creates a question and navigates to question's details page
     *
     * @param input
     * @returns A promise with the created question's url
     */
    public static async createQuestionAndViewDetail(input: ICreateQuestionInput): Promise<string> {
        await this.createQuestion(input);
        const questionListPage = new QuestionListPage();
        const questionItem = await questionListPage.getQuestionItemByTitle(input.title);
        await questionItem.openDetail();

        await Helper.waitForUrl("/question/");
        return await browser.getCurrentUrl();
    }

    /**
     * Deletes all of the existing questions
     *
     * @returns A promise with void
     */
    public static async deleteAllQuestions(): Promise<void> {
        const questionListPage = new QuestionListPage();
        await questionListPage.navigateTo();

        await Helper.waitForUrl("/questions");

        await questionListPage.deleteAllQuestions();
    }
}
