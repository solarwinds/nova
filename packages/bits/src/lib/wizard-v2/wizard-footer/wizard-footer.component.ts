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

import { FocusableOption, FocusMonitor } from "@angular/cdk/a11y";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    ViewEncapsulation,
} from "@angular/core";

import { WizardStepFooterDirective } from "../wizard-step-footer.directive";

/** @ignore */
@Component({
    selector: "wizard-footer",
    templateUrl: "wizard-footer.component.html",
    styleUrls: ["wizard-footer.component.less"],
    host: {
        class: "nui-wizard-footer",
        role: "tab",
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardFooterComponent
    implements FocusableOption, AfterViewInit, OnDestroy
{
    /** Label of the given step. */
    @Input() footer: WizardStepFooterDirective | string;

    constructor(
        private _focusMonitor: FocusMonitor,
        private _elementRef: ElementRef<HTMLElement>
    ) {}

    public ngAfterViewInit(): void {
        this._focusMonitor.monitor(this._elementRef, true);
    }

    public ngOnDestroy(): void {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    /** Focuses the step footer. */
    focus(): void {
        this._focusMonitor.focusVia(this._elementRef, "program");
    }

    /** Returns wizardStepFooter if the footer of the current step */
    _templateFooter(): WizardStepFooterDirective | null {
        return this.footer instanceof WizardStepFooterDirective
            ? this.footer
            : null;
    }
}
