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

import { by, ElementArrayFinder, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";

export class RepeatAtom extends Atom {
    public static CSS_CLASS = "nui-repeat";

    public getItems(): ElementArrayFinder {
        return super.getElement().all(by.css(".repeat-group-item"));
    }

    public itemCount = async (): Promise<number> => this.getItems().count();

    public getItem = (idx: number): ElementFinder => this.getItems().get(idx);

    public isNormal = async (): Promise<boolean> =>
        this.hasClass("nui-repeat__normal");

    public isCompact = async (): Promise<boolean> =>
        this.hasClass("nui-repeat__compact");

    public get vScrollViewport(): ElementFinder {
        return super
            .getElement()
            .element(by.className("cdk-virtual-scroll-viewport"));
    }

    public get vScrollViewportContent(): ElementFinder {
        return super
            .getElement()
            .element(by.className("cdk-virtual-scroll-content-wrapper"));
    }

    public selectCheckbox = async (idx: number): Promise<void> =>
        this.getCheckbox(idx).toggle();

    public selectCheckboxes = async (...indexes: number[]): Promise<void> => {
        for (const index of indexes) {
            await this.selectCheckbox(index);
        }
    };

    public getCheckbox = (idx: number): CheckboxAtom => {
        const checkboxElement = this.getItem(idx).element(
            by.className("nui-checkbox")
        );
        return new CheckboxAtom(checkboxElement);
    };

    public selectRow = async (idx: number): Promise<void> =>
        this.getItem(idx).element(by.css(".nui-repeat-item__content")).click();

    public selectRows = async (...indexes: number[]): Promise<void> => {
        for (const index of indexes) {
            await this.selectRow(index);
        }
    };

    public selectRadioRow = async (idx: number): Promise<void> =>
        this.getItem(idx).element(by.css(".nui-repeat-item")).click();

    public selectRadio = async (idx: number): Promise<void> =>
        this.getItem(idx).element(by.css(".nui-radio")).click();

    public isStriped = async (): Promise<boolean> => {
        const items = this.getItems();
        const lineOneColor = await items
            .first()
            .getCssValue("background-color");
        const lineTwoColor = await items.get(1).getCssValue("background-color");
        return lineOneColor !== lineTwoColor;
    };

    public isItemSelected = async (idx: number): Promise<boolean> => {
        const classValue = await this.getItem(idx)
            .element(by.css("li.nui-repeat-item"))
            .getAttribute("class");
        return classValue?.indexOf("nui-repeat-item--selected") >= 0;
    };

    public async isEmptyTextPresented(): Promise<boolean> {
        return super
            .getElement()
            .element(
                by.css(".nui-repeat__empty .nui-repeat__empty--main-message")
            )
            .isPresent();
    }

    public async getEmptyText(): Promise<string> {
        return super
            .getElement()
            .element(
                by.css(".nui-repeat__empty .nui-repeat__empty--main-message")
            )
            .getText();
    }

    public async getHeaderText(): Promise<string> {
        return super
            .getElement()
            .element(by.css(".nui-repeat-header"))
            .getText();
    }

    public async getVScrollViewportHeight(): Promise<string> {
        return this.vScrollViewport.getCssValue("height");
    }

    public async getVScrollViewportContentHeight(): Promise<string> {
        return this.vScrollViewportContent.getCssValue("height");
    }
}
