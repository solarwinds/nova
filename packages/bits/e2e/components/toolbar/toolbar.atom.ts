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
import { ButtonAtom } from "../button/button.atom";
import { MenuAtom } from "../menu/menu.atom";
import { PopupAtom } from "../popup/popup.atom";

export class ToolbarAtom extends Atom {
    public static CSS_CLASS = "nui-toolbar";

    public get popup(): PopupAtom {
        return Atom.findIn<PopupAtom>(PopupAtom, this.getLocator());
    }

    /** Locator for all visible dynamic toolbar item buttons. */
    public get visibleItems(): Locator {
        return this.getLocator().locator(
            ".nui-toolbar-content__dynamic > .nui-button"
        );
    }

    /** Get a toolbar item button atom by index. */
    public getItemButton(index: number): ButtonAtom {
        return Atom.findIn<ButtonAtom>(
            ButtonAtom,
            this.visibleItems.nth(index),
            true
        );
    }

    /** Get the toolbar's overflow menu atom. */
    public get menu(): MenuAtom {
        return Atom.findIn<MenuAtom>(MenuAtom, this.getLocator());
    }

    /** Locator for the selected-state text element. */
    public get selectedStateText(): Locator {
        return this.getLocator().locator(".nui-toolbar-content__select");
    }

    /** Locator for all toolbar message elements. */
    public get messages(): Locator {
        return this.getLocator().locator("nui-toolbar-message");
    }

    // --- Retryable assertions ---

    /** Assert the number of visible toolbar item buttons. */
    public async toHaveVisibleItemsCount(count: number): Promise<void> {
        await expect(this.visibleItems).toHaveCount(count);
    }

    /** Assert the toolbar's selected-state text. */
    public async toHaveSelectedStateText(
        expected: string | RegExp
    ): Promise<void> {
        await expect(this.selectedStateText).toHaveText(expected);
    }

    /** Assert the number of toolbar messages. */
    public async toHaveMessagesCount(count: number): Promise<void> {
        await expect(this.messages).toHaveCount(count);
    }
}
