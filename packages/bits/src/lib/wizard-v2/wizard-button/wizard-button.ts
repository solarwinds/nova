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

import { CdkStepperNext, CdkStepperPrevious } from "@angular/cdk/stepper";
import { Directive, Input } from "@angular/core";

/** Button that moves to the next step in a stepper workflow.
 * @ignore
 */
@Directive({
    selector: "button[nuiWizardNext]",
    host: { "[type]": "type" },
})
export class WizardStepperNextDirective extends CdkStepperNext {
    @Input() declare type: string;
}

/** Button that moves to the previous step in a stepper workflow.
 * @ignore
 */
@Directive({
    selector: "button[nuiWizardPrevious]",
    host: { "[type]": "type" },
})
export class WizardStepperPreviousDirective extends CdkStepperPrevious {
    @Input() declare type: string;
}
