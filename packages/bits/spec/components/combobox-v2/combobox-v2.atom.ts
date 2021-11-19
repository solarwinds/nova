import isNil from "lodash/isNil";
import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { IconAtom } from "../icon/icon.atom";
import { OverlayAtom } from "../overlay/overlay.atom";
import { BaseSelectV2Atom } from "../select-v2/base-select-v2.atom";

export class ComboboxV2Atom extends BaseSelectV2Atom {
    public static CSS_CLASS = "nui-combobox-v2";
    public static async type(text: string): Promise<void> {
        return browser.actions().sendKeys(text).perform();
    }

    public popup: OverlayAtom = Atom.findIn(OverlayAtom, element(by.className("combobox-v2-test-pane")));
    public removeAllButton = this.getElement().element(by.className("nui-combobox-v2__remove-value"));
    public createOption = this.getPopupElement().element(by.className("nui-combobox-v2__create-option"));
    public toggleButton = this.getElement().element(by.className("nui-combobox-v2__toggle"));
    public input = this.getElement().element(by.className("nui-combobox-v2__input"));
    public chips = this.getElement().all(by.css("nui-chip"));
    public activeChip = this.getElement().element(by.css("nui-chip.active"));
    public activeOption = this.getPopupElement().element(by.css("nui-select-v2-option.active"));

    public async removeAll(): Promise<void> {
        return this.removeAllButton.click();
    }

    public async removeChips(amount: number): Promise<void> {
        await this.chips.each(async (chip?: ElementFinder, i?: number) => {
            if (!chip || isNil(i)) {
                throw new Error("chip is not defined");
            }
            if (amount > i) {
                await Atom.findIn(IconAtom, chip).getElement().click();
            }
        });
    }

    public async selectAll(): Promise<void> {
        let i: number = await this.countOptions();

        while (i > 0) {
            await (await this.getOption(i - 1)).click();
            i--;
        }
    }

    public async selectFirst(numberOfItems?: number): Promise<void> {
        let items = numberOfItems || 1;
        while (items > 0) {
            await (await this.getOption(items)).click();
            items--;
        }
    }

    public async getInputValue(): Promise<any> {
        return this.input.getAttribute("value");
    }

    public async getSelectionStart(): Promise<number> {
        return await browser.executeScript("return arguments[0].selectionStart", await this.input.getWebElement());
    }

    public async getSelectionEnd(): Promise<number> {
        return await browser.executeScript("return arguments[0].selectionEnd", await this.input.getWebElement());
    }

    public async getSelectionRange(): Promise<number> {
        return (await this.getSelectionEnd()) - (await this.getSelectionStart());
    }
}
