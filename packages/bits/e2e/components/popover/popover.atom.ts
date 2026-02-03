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
import { Helpers, expect } from "../../setup";

export class PopoverAtom extends Atom {
    public static CSS_CLASS = "nui-popover";
    // expose backdrop via a function per request
    public static getBackdrop(): Locator {
        return Helpers.page.locator(".cdk-overlay-backdrop");
    }
    public static findIn<T extends Atom>(
        atomClass: any,
        parentLocator: Locator,
        root = true
    ): T {
        return Atom.findIn(atomClass, parentLocator, root);
    }

    public popoverModalId: string;

    private modalBackdrop: Locator = PopoverAtom.getBackdrop();
    private containerAnimationInProgress: Locator = Helpers.page.locator(
        "div.nui-popover-container-animation.ng-animating"
    );

    constructor(root?: Locator) {
        // Align with other atoms using Atom base constructor without ElementFinder
        // If root is not provided, default to the atom's CSS_CLASS
        super(root ?? Helpers.page.locator(`.${PopoverAtom.CSS_CLASS}`));
    }

    public togglePopover = async (): Promise<void> => {
        const wasDisplayed = await this.isPopoverDisplayed();
        const hasBackdrop = await this.modalBackdrop.isVisible();
        if (hasBackdrop) {
            await this.modalBackdrop.click();
        } else {
            await this.clickTarget();
        }
        return wasDisplayed ? this.waitForClosed() : this.waitForOpen();
    };

    public open = async (): Promise<void> => {
        if (await this.isPopoverDisplayed()) {
            return;
        }

        await this.clickTarget();
        return this.waitForOpen();
    };

    public openByHover = async (): Promise<void> => {
        if (await this.isPopoverDisplayed()) {
            return;
        }

        await this.hover();
        return this.waitForOpen();
    };

    public closeModal = async (): Promise<void> => {
        await this.modalBackdrop.click();
        return this.waitForClosed();
    };

    public waitForOpen = async (timeout: number = 1000): Promise<void> => {
        const errorMessage = "Popover failed to open";
        const body = this.getPopoverBody();
        await expect(body, errorMessage).toBeVisible({ timeout: timeout * 2 });
        // Wait until animation class disappears if present
        await expect(
            this.containerAnimationInProgress,
            errorMessage
        ).toHaveCount(0, { timeout: timeout * 2 });
    };

    public waitForClosed = async (timeout: number = 1000): Promise<void> => {
        const body = this.getPopoverBody();
        await expect(body, "Popover is closed").toBeHidden();
    };

    public isPopoverDisplayed = async (): Promise<boolean> =>
        this.getPopoverBody().isVisible();

    public getTitle = (): Locator => Helpers.page.locator(".nui-popover-container__title");

    public isDisplayedRight = async (): Promise<boolean> =>
        this.bodyHasClass("nui-popover-container--right");
    public isDisplayedLeft = async (): Promise<boolean> =>
        this.bodyHasClass("nui-popover-container--left");
    public isDisplayedTop = async (): Promise<boolean> =>
        this.bodyHasClass("nui-popover-container--top");
    public isDisplayedBottom = async (): Promise<boolean> =>
        this.bodyHasClass("nui-popover-container--bottom");

    public clickTarget = async (): Promise<void> => this.getLocator().click();

    /*
        !!! WARNING !!!
        As popovers are attached to body by default we should use popoverModalId everywhere!
        Another way is to introduce custom way to identify popover by trigger (like custom attribute),
        so atom will be operating with popover it is responsible for.
        Right now we are taking first available .nui-popover-container from the dom and asume that it is the thing we were looking for.
        Or taking an element inside of content that is completely different from .nui-popover-container.
        That is why we need to call this function every time.
    */
    public getPopoverBody = (): Locator =>
        this.popoverModalId
            ? Helpers.page.locator(`#${this.popoverModalId}`)
            : Helpers.page.locator(".nui-popover-container");

    public hover = async (): Promise<void> => this.getLocator().hover();

    private bodyHasClass = async (className: string): Promise<boolean> => {
        const classAttr = await this.getPopoverBody().getAttribute("class");
        return !!classAttr && classAttr.split(/\s+/).includes(className);
    };
}
