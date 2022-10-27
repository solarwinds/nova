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

import { by, ElementFinder } from "protractor";

import { Atom, ButtonAtom } from "@nova-ui/bits/sdk/atoms";

export class DashboardWizardAtom extends Atom {
    public static CSS_CLASS = "nui-dashwiz";

    private root = this.getElement();

    public backButton = new ButtonAtom(
        this.root.element(by.className("nui-dashwiz-buttons__back-button"))
    );
    public nextButton = new ButtonAtom(
        this.root.element(by.className("nui-dashwiz-buttons__next-button"))
    );
    public finishButton = new ButtonAtom(
        this.root.element(by.className("nui-dashwiz-buttons__finish-button"))
    );
    public cancelButton = new ButtonAtom(
        this.root.element(by.className("nui-dashwiz-buttons__cancel-button"))
    );

    public back = async (): Promise<void> => this.backButton.click();

    public next = async (): Promise<void> => this.nextButton.click();

    public cancel = async (): Promise<void> => this.cancelButton.click();

    public finish = async (): Promise<void> => this.finishButton.click();

    public getHeader = (): ElementFinder =>
        this.root.element(by.css(".nui-dashwiz__header"));

    public getActiveStep = (): ElementFinder =>
        this.root.element(by.css(".nui-dashwiz-step--active"));
}
