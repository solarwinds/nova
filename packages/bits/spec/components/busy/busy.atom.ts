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

import { by } from "protractor";

import { Atom } from "../../atom";
import { ProgressAtom } from "../progress/progress.atom";
import { SpinnerAtom } from "../spinner/spinner.atom";

export class BusyAtom extends Atom {
    public static CSS_CLASS = "nui-nova-busy";

    private root = this.getElement();

    public isAppended = async (): Promise<boolean> =>
        this.root.element(by.css(".nui-nova-busy__container")).isPresent();

    public isDisplayed = async (): Promise<boolean> =>
        this.root.element(by.css(".nui-nova-busy__container")).isDisplayed();

    public isBusy = async (): Promise<boolean> =>
        this.root.element(by.css(".nui-nova-busy__overlay")).isPresent();

    public getProgress = (): ProgressAtom =>
        Atom.findIn(ProgressAtom, this.root);

    public getSpinner = (): SpinnerAtom => Atom.findIn(SpinnerAtom, this.root);
}
