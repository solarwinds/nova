import { browser, by, element, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { OverlayAtom } from "../overlay/overlay.atom";

import { SelectV2OptionAtom } from "./select-v2-option.atom";

export class BaseSelectV2Atom extends Atom {
    public popup: OverlayAtom = Atom.findIn(
        OverlayAtom,
        element(by.tagName("body"))
    );

    public getPopupElement() {
        return this.popup.getElement();
    }

    /**
     * Note: Despite its name, this method will only OPEN the dropdown. To toggle it closed, use this
     * Atom's "click" method.
     */
    public async toggle(): Promise<void> {
        await this.getElement().click();
        await this.waitForPopup();
    }

    public async getOption(index: number): Promise<SelectV2OptionAtom> {
        if (!(await this.popup.isOpened())) {
            await this.toggle();
        }
        return Atom.findIn(SelectV2OptionAtom, this.popup.getElement(), index);
    }

    public async getFirstOption(): Promise<SelectV2OptionAtom> {
        return this.getOption(0);
    }

    public async getLastOption(): Promise<SelectV2OptionAtom> {
        const count = await Atom.findCount(
            SelectV2OptionAtom,
            this.getElement()
        );
        return this.getOption(count - 1);
    }

    public async countOptions(): Promise<number> {
        if (!(await this.popup.isOpened())) {
            await this.toggle();
        }
        return Atom.findCount(SelectV2OptionAtom, this.popup.getElement());
    }

    /**
     * Note: This method checks whether ANY 'cdk-overlay-pane' on the document body is present
     * (not just this dropdown instance). Close any other cdk-overlay-pane instances before invoking this
     * method to ensure an accurate return value.
     */
    public async isOpened(): Promise<boolean> {
        return this.popup.isOpened();
    }

    public async getActiveItemsCount(): Promise<number> {
        return this.popup.getElement().all(by.className("active")).count();
    }

    public async type(text: string) {
        await this.getElement().click();
        return browser.actions().sendKeys(text).perform();
    }

    public click = async (): Promise<void> => this.getElement().click();

    public async isSelectDisabled(): Promise<boolean> {
        const classAttr = await this.getElement().getAttribute("class");
        return classAttr.includes("disabled");
    }

    public async select(title: string): Promise<void> {
        if (!(await this.popup.isPresent())) {
            await this.toggle();
        }

        const options = this.popup
            .getElement()
            .all(by.css("nui-select-v2-option"));
        const optionsText: string[] = await options.map(
            async (option) => await option?.getText()
        );
        const titleIndex = optionsText.indexOf(title);

        if (titleIndex !== -1) {
            await (await this.getOption(titleIndex)).click();
        }
    }

    private async waitForPopup() {
        return await browser.wait(
            ExpectedConditions.visibilityOf(this.popup.getElement())
        );
    }
}
