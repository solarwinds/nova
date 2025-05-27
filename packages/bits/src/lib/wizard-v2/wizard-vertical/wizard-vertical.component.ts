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

import { Directionality } from "@angular/cdk/bidi";
import { BooleanInput } from "@angular/cdk/coercion";
import { CdkStepper } from "@angular/cdk/stepper";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    Optional,
    ViewEncapsulation,
} from "@angular/core";

import { WizardDirective } from "../wizard.directive";

/**  ignore should be removed in scope of the NUI-6099 */
/** @ignore */
@Component({
    selector: "nui-wizard-vertical",
    exportAs: "wizardVertical",
    templateUrl: "wizard-vertical.component.html",
    styleUrls: ["../wizard.component.less"],
    host: {
        class: "nui-wizard-vertical-layout",
        "aria-orientation": "vertical",
        role: "tablist",
    },
    providers: [
        { provide: WizardDirective, useExisting: WizardVerticalComponent },
        { provide: CdkStepper, useExisting: WizardVerticalComponent },
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardVerticalComponent extends WizardDirective {
    static ngAcceptInputTypeEditable: BooleanInput = undefined;
    static ngAcceptInputTypeOptional: BooleanInput = undefined;
    static ngAcceptInputTypeCompleted: BooleanInput = undefined;
    static ngAcceptInputTypeHasError: BooleanInput = undefined;

    public get selectedIndex(): number {
        return super.selectedIndex;
    }
    @Input()
    public set selectedIndex(value: number) {
        super.selectedIndex = value;
    }

    constructor(
        @Optional() dir: Directionality,
        changeDetectorRef: ChangeDetectorRef,
        elementRef: ElementRef<HTMLElement>
    ) {
        super(dir, changeDetectorRef, elementRef);
        this["_orientation"] = "vertical";
    }
}
