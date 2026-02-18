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

import { Atom } from "../atom";
import { IconAtom } from "./icon.atom";

export class ExpanderAtom extends Atom {
    public static CSS_CLASS = "nui-expander";
    public static animationDuration = 350;

    private root = this.getElement();
    private body = this.root.all(by.css(".nui-expander__body-wrapper")).first();

    public isExpanded = async (): Promise<boolean> =>
        (await this.body.getSize()).height > 0;

    public isCollapsed = async (): Promise<boolean> =>
        !(await this.isExpanded());

    public async isContentDisplayed(
        cssSelectorSet: string | string[]
    ): Promise<boolean> {
        if (!Array.isArray(cssSelectorSet)) {
            cssSelectorSet = [cssSelectorSet];
        }

        const verifiers = cssSelectorSet.map(async (selector: string) =>
            this.root.element(by.css(selector)).isDisplayed()
        );

        return Promise.all(verifiers).then((result) =>
            result.every((resultItem: boolean) => resultItem)
        );
    }

    public async isContentAttachedToDOM(
        cssSelectorSet: string | string[]
    ): Promise<boolean> {
        if (!Array.isArray(cssSelectorSet)) {
            cssSelectorSet = [cssSelectorSet];
        }

        const verifiers = cssSelectorSet.map(async (selector: string) =>
            this.root.element(by.css(selector)).isPresent()
        );

        return Promise.all(verifiers).then((result) =>
            result.every((resultItem: boolean) => resultItem)
        );
    }

    public isHeaderIconPresent = async (): Promise<boolean> =>
        IconAtom.findIn(
            IconAtom,
            this.getElement().element(
                by.css(".nui-expander__header-content-icon")
            )
        )
            .getElement()
            .isPresent();

    public getExpanderToggleIcon = (): IconAtom =>
        IconAtom.findIn(
            IconAtom,
            this.getElement().element(by.css(".nui-expander__header-icon"))
        );

    public getBodyLeftBorderWidth = async (): Promise<string> =>
        this.root
            .all(by.css(".nui-expander__body"))
            .first()
            .getCssValue("border-left-width");

    public toggle = async (): Promise<void> => {
        await this.root.element(by.css(".nui-expander__header")).click();
        // This is unfortunate, but there is no other way to wait for angular animation, other than doing a special build
        // We should try to test it in units as good as possible
        return browser.sleep(ExpanderAtom.animationDuration * 1.5);
    };

    public getHeadingText = async (): Promise<string> =>
        this.root
            .element(by.css(".nui-expander__header-content-wrapper"))
            .getText();

    public getHeaderHeight = async (): Promise<number> =>
        (
            await this.root
                .element(by.css(".nui-expander__header-title"))
                .getSize()
        ).height;

    public getCustomHeaderWidth = async (): Promise<number> =>
        (
            await this.root
                .element(by.css(".nui-expander__custom-header"))
                .getSize()
        ).width;
}
