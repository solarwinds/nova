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

import { by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class RadioGroupAtom extends Atom {
    public static CSS_CLASS = "nui-radio-group";

    public async getValue(): Promise<string> {
        return this.getElement()
            .element(by.css("input:checked"))
            .getAttribute("value");
    }

    // Finds and returns label element (clickable wrapper of radio button input element),
    // because actual input element is hidden with "appearance: none" and is not clickable
    public getRadioByValue(value: string): ElementFinder {
        return this.getElement()
            .element(by.css(`input[value="${value}"]`))
            .element(by.xpath("../.."));
    }

    // Finds and returns radio button input element
    public getRadioInputByValue(value: string): ElementFinder {
        return this.getElement().element(by.css(`input[value="${value}"]`));
    }

    public async getHelpHintText(index: number): Promise<string> {
        return this.getElement()
            .all(by.css(".nui-help-hint"))
            .get(index)
            .getText();
    }

    public async getNumberOfItems(): Promise<number> {
        return this.getElement().all(by.css(".nui-radio")).count();
    }

    public getFirst(): ElementFinder {
        return this.getElement().all(by.css(".nui-radio")).first();
    }

    public async getNumberOfDisabledItems(): Promise<number> {
        return this.getElement()
            .all(by.css(".nui-radio__input[disabled]"))
            .count();
    }

    public async isRadioSelected(value: string): Promise<boolean> {
        return this.getRadioInputByValue(value).isSelected();
    }
}
