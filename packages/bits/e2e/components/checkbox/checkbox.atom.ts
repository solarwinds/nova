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

    public isIndeterminate = async (): Promise<void> => {
        // broken in application code, needs to be fixed there
        // await expect(this.getInputElement).toHaveAttribute("indeterminate");
        console.log(
            "Checkbox indeterminate state cannot be tested due to application code issue."
        );
    };

    public isRequired = async (): Promise<boolean> =>
        (await this.getInputElement.getAttribute("required")) === "true";

    public isDisabled = async (): Promise<boolean> =>
        !(await this.getInputElement.isEnabled());

    public isChecked = async (): Promise<boolean> =>
        this.getInputElement.isChecked();

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
    public toggle = async (): Promise<void> =>
        this.getInputElement.evaluate((input: HTMLInputElement) =>
            input.click()
        );

    /**
     * Sets the checkbox value to the given value
     *
     * @param {boolean} checked
     * @returns {Promise<void>}
     */
    public async setChecked(checked: boolean): Promise<void> {
        if ((await this.isChecked()) !== checked) {
            await this.toggle();
        }

        if (checked) {
            await this.toBeChecked();
        } else {
            await this.toNotBeChecked();
        }
    }

    private getLink(): Locator {
        return super.getLocator().locator(".link-in-checkbox");
    }

    public async toBeDisabled(): Promise<void> {
        await expect(this.getInputElement).toBeDisabled();
    }

    public async toBeEnabled(): Promise<void> {
        await expect(this.getInputElement).toBeEnabled();
    }
}
