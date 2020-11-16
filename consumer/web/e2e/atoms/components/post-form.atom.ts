import { Atom, FormFieldAtom, TextboxAtom } from "@solarwinds/nova-bits/sdk/atoms";
import { by, ElementFinder } from "protractor";

export class PostFormAtom extends Atom {
    public static CSS_CLASS = "rd-post-form";

    public get textTextbox(): TextboxAtom {
        return Atom.findIn(TextboxAtom, this.getElement().element(by.css("nui-textbox[formControlName='text']")));
    }

    public get textFormField(): FormFieldAtom {
        return Atom.findIn(FormFieldAtom, this.getElement().element(by.className("rd-postform__text-field")));
    }

    public get authorTextbox(): TextboxAtom {
        return Atom.findIn(TextboxAtom, this.getElement().element(by.css("nui-textbox[formControlName='author']")));
    }

    public get authorFormField(): FormFieldAtom {
        return Atom.findIn(FormFieldAtom, this.getElement().element(by.className("rd-postform__author-field")));
    }

    public get textPreview(): ElementFinder {
        return this.getElement().element(by.className("rd-post-form__preview"));
    }

    public async getTextPreviewHtml(): Promise<string> {
        return this.getElement().element(by.className("rd-post-form__preview")).getAttribute("innerHTML");
    }

}
