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

import { Atom } from "../atom";
import { BusyAtom } from "./busy.atom";
import { IconAtom } from "./icon.atom";

export class WizardStepAtom extends Atom {
    public static CSS_CLASS = "nui-wizard__step";

    private root = this.getElement();

    // step header
    public icon: IconAtom = Atom.findIn(IconAtom, this.root);

    // step body
    public busy: BusyAtom = Atom.findIn(BusyAtom, this.root);
    private stepTitle: ElementFinder = this.root
        .all(by.className("nui-wizard__step-title"))
        .first();
    public getStepTitle = async (): Promise<string> => this.stepTitle.getText();
}

// WARNING!!!
// it will never be able to return both header and body pillars at the same time
// this atom should be split into WizardStepHeaderAtom and WizardStepBodyAtom
// Tests should operate with IWizardStep

// export interface IWizardStep {
//     header: WizardStepHeaderAtom;
//     body: WizardStepBodyAtom;
// }
