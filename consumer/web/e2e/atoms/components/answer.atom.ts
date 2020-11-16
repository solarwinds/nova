import { browser, by, element, ElementFinder } from "protractor";

import { Atom, ButtonAtom, DialogAtom, IconAtom } from "@solarwinds/nova-bits/sdk/atoms";

import { Helper } from "../../helper";

import { PostFormAtom } from "./post-form.atom";
import { PostAtom } from "./post.atom";

export class AnswerAtom extends Atom {
    public static CSS_CLASS = "rd-answer";

    public postForm: PostFormAtom;
    public post: PostAtom;
    public deleteLink: ElementFinder;
    public editLink: ElementFinder;
    public saveButton: ButtonAtom;
    public cancelEditingButton: ButtonAtom;
    public acceptedIcon: IconAtom;
    public acceptedButton: ButtonAtom;
    public upVoteButton: ButtonAtom;
    public downVoteButton: ButtonAtom;
    public voteCount: ElementFinder;

    constructor(rootElement: ElementFinder) {
        super(rootElement);

        this.editLink = rootElement.element(by.className("rd-answer__edit"));
        this.deleteLink = rootElement.element(by.className("rd-answer__delete"));
        this.postForm = Atom.findIn(PostFormAtom, rootElement.element(by.className("rd-answer__post-form")));
        this.post = Atom.findIn(PostAtom, rootElement.element(by.className("rd-answer__post")));
        this.saveButton = Atom.findIn(ButtonAtom, rootElement.element(by.className("rd-answer__save-answer")));
        this.cancelEditingButton = Atom.findIn(ButtonAtom, rootElement.element(by.className("rd-answer__cancel-editing")));
        this.acceptedIcon = Atom.findIn(IconAtom, rootElement.element(by.className("rd-answer__accepted-answer-button")));
        this.acceptedButton = Atom.findIn(ButtonAtom, rootElement.element(by.className("rd-answer__accepted-answer-button")));
        this.upVoteButton = Atom.findIn(ButtonAtom, rootElement.element(by.className("rd-answer__up-vote-button")));
        this.downVoteButton = Atom.findIn(ButtonAtom, rootElement.element(by.className("rd-answer__down-vote-button")));
        this.voteCount = rootElement.element(by.className("rd-answer__vote-count"));
    }

    /**
     * Enables edit mode, updates text and submits the form
     *
     * @param {string} answerText
     * @returns {Promise<void>}
     */
    public async update(answerText: string): Promise<void> {
        await this.switchToEditing();

        await this.postForm.textTextbox.clearText();
        await this.postForm.textTextbox.acceptText(answerText);

        await this.saveButton.click();

        await browser.wait(async () => !(await this.isEditing()));
    }

    public async delete(): Promise<void> {
        await this.deleteLink.click();

        const dialog = Atom.findIn(DialogAtom, element(by.tagName("body")));
        await dialog.getActionButton().click();

        await browser.wait(async () => !(await this.getElement().isPresent()), Helper.BROWSER_WAIT_TIMEOUT);
    }

    public async markAccepted(): Promise<void> {
        if (await this.acceptedIcon.getName() === "step-complete") {
            await this.acceptedButton.click();
            await browser.sleep(500);
        }
    }

    public async unmarkAccepted(): Promise<void> {
        if (await this.acceptedIcon.getName() === "status_up") {
            await this.acceptedButton.click();
            await browser.sleep(500);
        }
    }

    public async isAcceptanceDisabled(): Promise<boolean> {
        return await this.acceptedIcon.getName() === "status_testing" && await this.acceptedButton.isDisabled();
    }

    public async isMarkedAsAccepted(): Promise<boolean> {
        return await this.acceptedIcon.getName() === "status_up" && await this.acceptedButton.isDisabled() === false;
    }

    public async isWaitingForAcceptance(): Promise<boolean> {
        return await this.acceptedIcon.getName() === "step-complete" && await this.acceptedButton.isDisabled() === false;
    }

    public async isWaitingForVote(): Promise<boolean> {
        if (await this.upVoteButton.getElement().isPresent() && await this.upVoteButton.getElement().isPresent()
            && await this.getVoteCount() === 0) {
            return true;
        }
        return false;
    }

    public async clickUpVote(): Promise<boolean> {
        const voteCount = await this.getVoteCount();

        await this.upVoteButton.click();

        return browser.wait(async () => await this.getVoteCount() !== voteCount, Helper.BROWSER_WAIT_TIMEOUT);
    }

    public async clickDownVote(): Promise<boolean> {
        const voteCount = await this.getVoteCount();

        await this.downVoteButton.click();

        return browser.wait(async () => await this.getVoteCount() !== voteCount, Helper.BROWSER_WAIT_TIMEOUT);
    }

    public async getVoteCount(): Promise<number> {
        return Number.parseInt(await this.voteCount.getText());
    }

    public async switchToEditing(): Promise<void> {
        if (await this.isEditing()) {
            throw new Error("Edit link is not visible, the answer is most likely in edit mode already");
        }
        return await this.editLink.click();
    }

    public async isEditing(): Promise<boolean> {
        return await this.postForm.getElement().isPresent();
    }

}
