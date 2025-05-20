import { Locator } from "@playwright/test";

import { Atom } from "../../atom";
import { expect } from "../../setup";

export class CheckboxAtom extends Atom {
    public static CSS_CLASS = "nui-checkbox";

    public get getInputElement(): Locator {
        return super.getLocator().locator(".nui-checkbox__input");
    }

    public get getLabel(): Locator {
        return super.getLocator().locator(".nui-checkbox__label");
    }

    public get getContent(): Locator {
        return super.getLocator().locator(".nui-checkbox__transclude");
    }

    public get getHelpHintText(): Locator {
        return super.getLocator().locator(".nui-help-hint");
    }

    public hoverLink = async (): Promise<void> => {
        await this.getLink().hover();
    };

    public isIndeterminate = async (): Promise<boolean> =>
        (await this.getInputElement.getAttribute("indeterminate")) === "true";

    public isRequired = async (): Promise<boolean> =>
        (await this.getInputElement.getAttribute("required")) === "true";

    public isDisabled = async (): Promise<boolean> =>
        !(await this.getInputElement.isEnabled());

    public isChecked = async (): Promise<boolean> =>
        (await this.getInputElement.getAttribute("checked")) === "true";

    public toBeChecked = async (): Promise<void> => {
        await expect(this.getInputElement).toBeChecked();
    };

    public toNotBeChecked = async (): Promise<void> => {
        await expect(this.getInputElement).not.toBeChecked();
    };

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

    private getMark(): Locator {
        return super.getLocator().locator(".nui-checkbox__mark");
    }

    private getLink(): Locator {
        return super.getLocator().locator(".link-in-checkbox");
    }
}
