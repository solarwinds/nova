import { Locator } from "playwright-core";

import { Atom } from "../../atom";

export class SelectV2Atom extends Atom {
    public static CSS_CLASS = "nui-select-v2";

    public async select(value: string): Promise<void> {
        // Click to open the dropdown
        await this.getLocator().click();

        // Wait for the options to be visible and select the matching option
        const optionSelector = `[data-value="${value}"], .nui-select-v2-option:has-text("${value}")`;
        const option = this.getLocator().page().locator(optionSelector).first();
        await option.click();
    }

    public async getSelectedValue(): Promise<string> {
        const selectedText = await this.getLocator().locator('.nui-select-v2__selected-value, .nui-select-v2__input').textContent();
        return selectedText || '';
    }
}
