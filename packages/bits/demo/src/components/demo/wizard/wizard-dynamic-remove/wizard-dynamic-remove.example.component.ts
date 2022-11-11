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

import { Component, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    IWizardSelectionEvent,
    WizardComponent,
    WizardStepComponent,
} from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-dynamic-remove-example",
    templateUrl: "./wizard-dynamic-remove.example.component.html",
})
export class WizardDynamicRemoveExampleComponent implements OnDestroy {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("dynamicStep") dynamicStep: WizardStepComponent;

    public selectedIndex: number;

    private destroy$ = new Subject<void>();

    public select(event: IWizardSelectionEvent): void {
        this.selectedIndex = event.selectedIndex;
    }

    public addStep(): void {
        const index = this.selectedIndex + 1;
        const step: WizardStepComponent = this.wizardComponent.addStepDynamic(
            this.dynamicStep,
            index
        );

        step.enter
            .pipe(takeUntil(this.destroy$))
            .subscribe(() =>
                console.log(
                    `Enter event has been emitted from WizardStepComponent`
                )
            );

        step.exit
            .pipe(takeUntil(this.destroy$))
            .subscribe(() =>
                console.log(
                    `Exit event has been emitted from WizardStepComponent`
                )
            );
    }

    public removeStep(index: number): void {
        this.wizardComponent.removeStep(index);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
