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

import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

export class SearchAtom extends Atom {
    public static CSS_CLASS = "nui-search";

    public async acceptInput(input: string): Promise<void> {
        await super
            .getElement()
            .element(by.css(".nui-search__input-control"))
            .sendKeys(input);
    }

    public async click(): Promise<void> {
        return super.getElement().click();
    }

    public getCancelButton(): ButtonAtom {
        return Atom.findIn(
            ButtonAtom,
            this.getElement().element(by.css(".nui-search__button-cancel"))
        );
    }

    public getSearchButton(): ButtonAtom {
        return Atom.findIn(
            ButtonAtom,
            this.getElement().element(by.css(".nui-button[icon=search]"))
        );
    }

    public async getValueAttr(): Promise<string> {
        return super
            .getElement()
            .element(by.tagName("input"))
            .getAttribute("value");
    }

    public async isFocused(): Promise<boolean> {
        const isFocused = this.getElement()
            .element(by.tagName("input"))
            .equals(await browser.driver.switchTo().activeElement());
        // please, call 'browser.driver.switchTo().defaultContent()' after each calling this method (just in case)
        await browser.driver.switchTo().defaultContent();
        return isFocused;
    }

    public async hasError(): Promise<boolean> {
        const searchGroup = this.getElement().element(
            by.css(".nui-search__group")
        );
        return await Atom.hasClass(searchGroup, "has-error");
    }
}
