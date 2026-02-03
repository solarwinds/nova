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

import { Locator } from "@playwright/test";

import { IconAtom, PopoverAtom } from "../../";
import { Atom } from "../../atom";
import { expect } from "../../setup";

export class FormFieldAtom extends Atom {
    public static CSS_CLASS = "nui-form-field";

    public get hint(): Locator {
        return this.getLocator().locator(".nui-help-hint");
    }

    public get caption(): Locator {
        return this.getLocator().locator(".nui-form-field__control-label");
    }

    public get stateText(): Locator {
        return this.getLocator().locator(".nui-form-field__state-text");
    }

    public get infoContainer(): Locator {
        return this.getLocator().locator(
            ".nui-form-field__control-label-container-info"
        );
    }

    public get validationMessages(): Locator {
        return this.getLocator().locator(".nui-validation-message");
    }

    public getInfoIcon = (): IconAtom =>
        Atom.findIn<IconAtom>(IconAtom, this.infoContainer);

    public getInfoPopover = (): PopoverAtom =>
        Atom.findIn<PopoverAtom>(PopoverAtom, this.infoContainer);

    public openInfoPopover = async (): Promise<void> => {
        await this.getInfoIcon().click();
    };

    public toHaveHintText = async (expected: string | RegExp): Promise<void> => {
        await expect(this.hint).toHaveText(expected);
    };

    public toHaveCaptionText = async (expected: string | RegExp): Promise<void> => {
        await expect(this.caption).toHaveText(expected);
    };

    public toHaveStateText = async (expected: string | RegExp): Promise<void> => {
        await expect(this.stateText).toHaveText(expected);
    };

    public toHaveErrorCount = async (expected: number): Promise<void> => {
        await expect(this.validationMessages).toHaveCount(expected);
    };

    public toHaveErrorText = async (
        index: number,
        expected: string | RegExp
    ): Promise<void> => {
        await expect(this.validationMessages.nth(index)).toHaveText(expected);
    };

    public toHaveErrors = async (expected: string[]): Promise<void> => {
        await expect(this.validationMessages).toHaveText(expected);
    };

    public toHaveNoErrors = async (): Promise<void> => {
        await expect(this.validationMessages).toHaveCount(0);
    };

    public toHaveHintVisible = async (): Promise<void> => {
        await expect(this.hint).toBeVisible();
    };

    public toHaveStateTextVisible = async (): Promise<void> => {
        await expect(this.stateText).toBeVisible();
    };
}
