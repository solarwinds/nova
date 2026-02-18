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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { expect } from "../../setup";
import { IconAtom } from "../icon/icon.atom";

export class ExpanderAtom extends Atom {
    public static CSS_CLASS = "nui-expander";

    public get body(): Locator {
        return this.getLocator().locator(".nui-expander__body-wrapper").first();
    }

    /** Uses child combinator to avoid matching nested expander headers. */
    public get header(): Locator {
        return this.getLocator().locator("> .nui-expander__header");
    }

    public get headingContent(): Locator {
        return this.getLocator().locator(
            ".nui-expander__header-content-wrapper"
        );
    }

    public get headerTitle(): Locator {
        return this.getLocator().locator(".nui-expander__header-title");
    }

    public get customHeader(): Locator {
        return this.getLocator().locator(".nui-expander__custom-header");
    }

    public get bodyElement(): Locator {
        return this.getLocator().locator(".nui-expander__body").first();
    }

    public get toggleIcon(): IconAtom {
        return Atom.findIn<IconAtom>(
            IconAtom,
            this.getLocator().locator(".nui-expander__header-icon")
        );
    }

    public get headerIcon(): IconAtom {
        return Atom.findIn<IconAtom>(
            IconAtom,
            this.getLocator().locator(".nui-expander__header-content-icon")
        );
    }

    public async toggle(): Promise<void> {
        await this.header.first().click();
    }

    public async expand(): Promise<void> {
        const height = (await this.body.boundingBox())?.height ?? 0;
        if (height === 0) {
            await this.toggle();
            await this.toBeExpanded();
        }
    }

    public async collapse(): Promise<void> {
        const height = (await this.body.boundingBox())?.height ?? 0;
        if (height > 0) {
            await this.toggle();
            await this.toBeCollapsed();
        }
    }

    public async toBeExpanded(): Promise<void> {
        await expect
            .poll(async () => {
                const box = await this.body.boundingBox();
                return (box?.height ?? 0) > 0;
            })
            .toBe(true);
    }

    public async toBeCollapsed(): Promise<void> {
        await expect
            .poll(async () => {
                const box = await this.body.boundingBox();
                return (box?.height ?? 0) === 0;
            })
            .toBe(true);
    }

    public async toHaveHeadingText(
        expected: string | RegExp
    ): Promise<void> {
        await expect(this.headingContent).toHaveText(expected);
    }

    public async toHaveHeaderIconVisible(): Promise<void> {
        await this.headerIcon.toBeVisible();
    }

    public async toHaveHeaderIconHidden(): Promise<void> {
        await this.headerIcon.toBeHidden();
    }

    public async toHaveBodyLeftBorderWidth(
        expected: string | RegExp
    ): Promise<void> {
        await expect(this.bodyElement).toHaveCSS(
            "border-left-width",
            expected
        );
    }

    public async toHaveContentVisible(
        cssSelectorSet: string | string[]
    ): Promise<void> {
        const selectors = Array.isArray(cssSelectorSet)
            ? cssSelectorSet
            : [cssSelectorSet];
        for (const selector of selectors) {
            await expect(this.getLocator().locator(selector)).toBeVisible();
        }
    }

    public async toHaveContentAttached(
        cssSelectorSet: string | string[]
    ): Promise<void> {
        const selectors = Array.isArray(cssSelectorSet)
            ? cssSelectorSet
            : [cssSelectorSet];
        for (const selector of selectors) {
            await expect(
                this.getLocator().locator(selector)
            ).toBeAttached();
        }
    }
}
