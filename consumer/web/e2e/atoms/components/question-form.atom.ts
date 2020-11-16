import { Atom, ButtonAtom, FormFieldAtom, TextboxAtom } from "@solarwinds/nova-bits/sdk/atoms";
import { by, ElementFinder } from "protractor";

import { PostFormAtom } from "./post-form.atom";

export class QuestionFormAtom extends Atom {
    public static CSS_CLASS = "rd-question-form";

    public titleTextbox: TextboxAtom;
    public titleFormField: FormFieldAtom;
    private postForm: PostFormAtom;
    public updateButton: ButtonAtom;
    public cancelButton: ButtonAtom;

    constructor(rootElement: ElementFinder) {
        super(rootElement);

        this.titleTextbox = Atom.findIn(TextboxAtom, rootElement.element(by.css("nui-textbox[formControlName='title']")));
        this.titleFormField = Atom.findIn(FormFieldAtom, rootElement.element(by.className("rd-question-form__title-field")));
        this.postForm = Atom.findIn(PostFormAtom, rootElement.element(by.className("rd-question-form__post")));
        this.updateButton = Atom.findIn(ButtonAtom, rootElement.element(by.className("rd-question-form__submit")));
        this.cancelButton = Atom.findIn(ButtonAtom, rootElement.element(by.className("rd-question-form__cancel")));
    }

    public get textTextbox(): TextboxAtom {
        return this.postForm.textTextbox;
    }

    public get textFormField(): FormFieldAtom {
        return this.postForm.textFormField;
    }

    public get authorTextbox(): TextboxAtom {
        return this.postForm.authorTextbox;
    }

    public get authorFormField(): FormFieldAtom {
        return this.postForm.authorFormField;
    }

    public get textPreview(): ElementFinder {
        return this.postForm.textPreview;
    }

    public async getTextPreviewHtml(): Promise<string> {
        return this.postForm.getTextPreviewHtml();
    }

}
