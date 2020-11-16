import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { by, ElementFinder } from "protractor";

export class PostAtom extends Atom {
    public static CSS_CLASS = "rd-post";

    private text: ElementFinder;
    private author: ElementFinder;
    private creationDate: ElementFinder;
    private updatedDate: ElementFinder;

    constructor(rootElement: ElementFinder) {
        super(rootElement);
        this.text = rootElement.element(by.className("rd-post__text"));
        this.author = rootElement.element(by.className("rd-post__author"));
        this.creationDate = rootElement.element(by.className("rd-post__creation-date"));
        this.updatedDate = rootElement.element(by.className("rd-post__updated-date"));
    }

    public async getText(): Promise<string> {
        return this.text.getText();
    }

    public async getTextHtml(): Promise<string> {
        return this.text.getAttribute("innerHTML");
    }

    public async getAuthor(): Promise<string> {
        return this.author.getText();
    }

    public async isUpdatedDatePresent(): Promise<boolean> {
        return this.updatedDate.isPresent();
    }

    public async isCreationDatePresent(): Promise<boolean> {
        return this.creationDate.isPresent();
    }

}
