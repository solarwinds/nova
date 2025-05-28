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

import { OverlayContentAtom } from "./overlay-content.atom";
import { Atom, IAtomClass } from "../../atom";
import { expect } from "../../setup";

export class PopupAtom extends Atom {
    public static CSS_CLASS = "nui-popup";

    public static findIn<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentLocator: Locator,
        root = true
    ): T {
        return Atom.findIn(atomClass, parentLocator, root);
    }

    public get popupBox(): OverlayContentAtom {
        return Atom.findIn<OverlayContentAtom>(
            OverlayContentAtom,
            this.getLocator()
        );
    }

    public get popupBoxDetached(): OverlayContentAtom {
        return Atom.findIn<OverlayContentAtom>(OverlayContentAtom);
    }

    public get getPopupToggle(): Locator {
        return this.getLocator().locator("[nuiPopupToggle]");
    }

    public async isOpened(): Promise<void> {
        await expect(this.getPopupBox).toBeVisible();
        await expect(this.popupBox.getLocator()).toHaveCount(1);
    }

    public async isNotOpened(): Promise<void> {
        await expect(this.getPopupBox).toBeHidden();
        await expect(this.popupBox.getLocator()).toHaveCount(0);
    }

    public async isOpenedAppendToBody(): Promise<void> {
        await expect(this.getPopupBoxDetached).toBeVisible();
        await expect(this.getPopupBoxDetached).toHaveCount(1);
    }

    public async isNotOpenedAppendToBody(): Promise<void> {
        await expect(this.getPopupBoxDetached).toBeHidden();
        await expect(this.getPopupBoxDetached).toHaveCount(0);
    }

    public async open(detached = false): Promise<void> {
        const toggle = this.getPopupToggle;
        await toggle.click();
        await expect(
            detached ? this.getPopupBoxDetached : this.getPopupBox
        ).toBeVisible();
    }

    public get getPopupBox(): Locator {
        return this.popupBox.getLocator();
    }

    public get getPopupBoxDetached(): Locator {
        return this.popupBoxDetached.getLocator();
    }

    public getPopupBoxDetachedArea(): Locator {
        return this.popupBoxDetached.getLocator().locator(".nui-popup__area");
    }
}
