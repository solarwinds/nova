import { browser, by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class CheckboxAtom extends Atom {
    public static CSS_CLASS = "nui-checkbox";

    constructor(element: ElementFinder) {
        super(element);
    }

    public getInputElement(): ElementFinder {
        return super.getElement().element(by.className("nui-checkbox__input"));
    }

    public getLabel(): ElementFinder {
        return super.getElement().element(by.className("nui-checkbox__label"));
    }

    public async getContent(): Promise<string> {
        return super
            .getElement()
            .element(by.className("nui-checkbox__transclude"))
            .getText();
    }

    public async getHelpHintText(): Promise<string> {
        return super
            .getElement()
            .element(by.className("nui-help-hint"))
            .getText();
    }

    public hoverLink = async (): Promise<void> =>
        browser
            .actions()
            .mouseMove(await this.getLink().getWebElement())
            .perform();

    public isIndeterminate = async (): Promise<boolean> =>
        (await this.getInputElement().getAttribute("indeterminate")) === "true";

    public isRequired = async (): Promise<boolean> =>
        (await this.getInputElement().getAttribute("required")) === "true";

    public isDisabled = async (): Promise<boolean> =>
        !(await this.getInputElement().isEnabled());

    public isChecked = async (): Promise<boolean> =>
        (await this.getInputElement().getAttribute("checked")) === "true";

    /**
     * Toggle the checkbox value
     *
     * @returns {Promise<void>}
     */
    public toggle = async (): Promise<void> => this.getMark().click();

    /**
     * Sets the checkbox value to the given value
     *
     * @param {boolean} checked
     * @returns {Promise<void>}
     */
    public async setChecked(checked: boolean): Promise<void> {
        if ((await this.isChecked()) !== checked) {
            return await this.toggle();
        }
    }

    private getMark(): ElementFinder {
        return super.getElement().element(by.className("nui-checkbox__mark"));
    }

    private getLink(): ElementFinder {
        return super.getElement().element(by.className("link-in-checkbox"));
    }
}
