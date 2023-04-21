// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    browser,
    by,
    element,
    ElementFinder,
    ExpectedConditions,
} from "protractor";

import { Atom } from "../../atom";
import { OverlayAtom } from "../overlay/overlay.atom";
import { SelectV2OptionAtom } from "./select-v2-option.atom";

export class BaseSelectV2Atom extends Atom {
    public popup: OverlayAtom = Atom.findIn(
        OverlayAtom,
        element(by.tagName("body"))
    );
    public input = this.getElement().element(
        by.className("nui-combobox-v2__input")
    );
    public getPopupElement(): ElementFinder {
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

    public async type(text: string): Promise<void> {
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
