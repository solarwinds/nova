import {
    Atom,
    ButtonAtom,
    FormFieldAtom,
    TextboxAtom
} from "@solarwinds/nova-bits/sdk/atoms";
import {
    browser,
    by,
    element
} from "protractor";

import { PostFormAtom } from "../atoms/components/post-form.atom";
import { Helper } from "../helper";

export interface ICreateQuestionInput {
    title: string;
    text: string;
    author: string;
}

export class CreateQuestionPage {
    public titleTextbox: TextboxAtom;
    public titleTextboxFormField: FormFieldAtom;
    public submitButton: ButtonAtom;
    public cancelButton: ButtonAtom;
    public postForm: PostFormAtom;

    constructor() {
        this.titleTextbox = Atom.findIn(TextboxAtom, element(by.css("nui-textbox[formControlName='title']")));
        this.titleTextboxFormField = Atom.findIn(FormFieldAtom, element(by.className("rd-createquestion-page__title-field")));
        this.submitButton = Atom.findIn(ButtonAtom, element(by.css("button[type='submit']")));
        this.cancelButton = Atom.findIn(ButtonAtom, element(by.linkText("Cancel")));
        this.postForm = Atom.findIn(PostFormAtom, element(by.css("rd-post-form")));
    }

    public async navigateTo(): Promise<void> {
        await browser.get("/question/ask");
        await Helper.waitForUrl("/question/ask");
    }

    public async createQuestion(input: ICreateQuestionInput): Promise<void> {
        await this.titleTextbox.acceptText(input.title);
        await this.postForm.textTextbox.acceptText(input.text);
        await this.postForm.authorTextbox.acceptText(input.author);
        await this.submitButton.click();
    }

    public async getHeaderText(): Promise<string> {
        return element(by.id("rd-create-question__page-header")).getText();
    }

}
