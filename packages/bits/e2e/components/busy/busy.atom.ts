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

import { Atom } from "../../atom";
import { ProgressAtom } from "../progress/progress.atom";
import { SpinnerAtom } from "../spinner/spinner.atom";

export class BusyAtom extends Atom {
    public static CSS_CLASS = "nui-nova-busy";

    private get root(): Locator {
        return this.getLocator();
    }

    public async isAppended(): Promise<boolean> {
        return await this.root.locator(".nui-nova-busy__container").count() > 0;
    }

    public async isDisplayed(): Promise<boolean> {
        const container = this.root.locator(".nui-nova-busy__container");
        return await container.isVisible();
    }

    public async isBusy(): Promise<boolean> {
        return await this.root.locator(".nui-nova-busy__overlay").count() > 0;
    }

    public getProgress(): ProgressAtom {
        return Atom.findIn<ProgressAtom>(ProgressAtom, this.root);
    }

    public getSpinner(): SpinnerAtom {
        return Atom.findIn<SpinnerAtom>(SpinnerAtom, this.root);
    }
}
