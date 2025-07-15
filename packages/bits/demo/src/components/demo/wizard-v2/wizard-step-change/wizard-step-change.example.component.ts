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

import { StepperSelectionEvent } from "@angular/cdk/stepper";
import {
  AfterViewInit,
  Component,
  TemplateRef,
  viewChild
} from "@angular/core";

import { ToastService, WizardHorizontalComponent } from "@nova-ui/bits";

interface IWizardStepData {
    title: string;
    templateRef: TemplateRef<string>;
}

@Component({
    selector: "nui-wizard-step-change-example",
    templateUrl: "./wizard-step-change.example.component.html",
    standalone: false,
})
export class WizardStepChangeExampleComponent implements AfterViewInit {
    public steps: IWizardStepData[] = [];

    readonly normalStep = viewChild<TemplateRef<string>>("normalStep");
    readonly wizard = viewChild.required<WizardHorizontalComponent>("wizard");

    constructor(private toastService: ToastService) {}

    public ngAfterViewInit(): void {
        this.addStep(this.normalStep(), $localize`Normal step`);
    }

    public addStep(templateRef: TemplateRef<string>, title?: string): void {
        this.steps.push({
            title: title ?? `Dynamic Step`,
            templateRef: templateRef,
        });
    }

    public onSelectionChange($event: StepperSelectionEvent): void {
        this.toastService.info({
            title: $localize`Selected step changed.`,
            message: $localize`You moved from step with index ${$event.previouslySelectedIndex} to step with index ${$event.selectedIndex}`,
            options: {
                timeOut: 5000,
                extendedTimeOut: 2000,
            },
        });
    }

    public resetWizard(): void {
        this.wizard().reset();
    }

    public finishWizard(): void {
        this.toastService.success({
            title: $localize`Success`,
            message: $localize`Wizard was completed successfully`,
            options: {
                timeOut: 2000,
            },
        });
    }
}
