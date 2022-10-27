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
import { Subscription } from "rxjs";

import {
    IWizardSelectionEvent,
    WizardComponent,
    WizardStepComponent,
} from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-dynamic-example",
    templateUrl: "./wizard-dynamic.example.component.html",
})
export class WizardDynamicExampleComponent implements OnDestroy {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("dynamicStep") dynamicStep: WizardStepComponent;

    public selectedIndex: number;

    private dynamicStepsSubscriptions: Subscription[] = [];

    public select(event: IWizardSelectionEvent) {
        this.selectedIndex = event.selectedIndex;
    }

    public addStep() {
        // addStepDynamic returns an instance of WizardStepComponent that was dynamically added
        const step: WizardStepComponent = this.wizardComponent.addStepDynamic(
            this.dynamicStep,
            this.selectedIndex + 1
        );
        // subscribe to entering the dynamic step and push it to subscriptions array
        this.dynamicStepsSubscriptions.push(
            step.enter.subscribe(() => {
                console.log(
                    "Enter event has been emitted from WizardStepComponent"
                );
            })
        );
        // subscribe to exiting the dynamic step and push it to subscriptions array
        this.dynamicStepsSubscriptions.push(
            step.exit.subscribe(() => {
                console.log(
                    "Exit event has been emitted from WizardStepComponent"
                );
            })
        );
    }

    public ngOnDestroy(): void {
        this.dynamicStepsSubscriptions.forEach((subscription) =>
            subscription.unsubscribe()
        );
    }
}
