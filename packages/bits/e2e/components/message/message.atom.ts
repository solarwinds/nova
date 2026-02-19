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

export class MessageAtom extends Atom {
    public static CSS_CLASS = "nui-message";

    /** Locator for the dismiss button inside the message. */
    public get dismissButton(): Locator {
        return this.getLocator().locator(".nui-message-dismiss-button");
    }

    /** Locator for the message content area. */
    public get content(): Locator {
        return this.getLocator().locator(".nui-message-content");
    }

    /** Returns the status icon Atom within this message. */
    public get statusIcon(): IconAtom {
        return Atom.findIn<IconAtom>(
            IconAtom,
            this.getLocator().locator(".nui-message-icon")
        );
    }

    // --- Actions ---

    /** Clicks the dismiss button and waits for the message to disappear. */
    public async dismiss(): Promise<void> {
        await this.dismissButton.click();
        await this.toBeHidden();
    }

    // --- Retryable assertions ---

    /** Assert the message is dismissable (dismiss button is visible). */
    public async toBeDismissable(): Promise<void> {
        await expect(this.dismissButton).toBeVisible();
    }

    /** Assert the message is NOT dismissable (dismiss button is hidden). */
    public async toNotBeDismissable(): Promise<void> {
        await expect(this.dismissButton).toBeHidden();
    }

    /** Assert the message border color. */
    public async toHaveBorderColor(expected: string | RegExp): Promise<void> {
        await expect(this.getLocator()).toHaveCSS("border-color", expected);
    }

    /** Assert the message background color. */
    public async toHaveBackgroundColor(
        expected: string | RegExp
    ): Promise<void> {
        await expect(this.getLocator()).toHaveCSS(
            "background-color",
            expected
        );
    }

    /** Assert the message content text. */
    public async toHaveContent(expected: string | RegExp): Promise<void> {
        await expect(this.content).toHaveText(expected);
    }
}
