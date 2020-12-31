import { Component, OnDestroy, ViewChild } from "@angular/core";
import { IWizardSelectionEvent, WizardComponent, WizardStepComponent } from "@nova-ui/bits";
import { Subscription } from "rxjs";

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
        const step: WizardStepComponent = this.wizardComponent.addStepDynamic(this.dynamicStep, this.selectedIndex + 1);
        // subscribe to entering the dynamic step and push it to subscriptions array
        this.dynamicStepsSubscriptions.push(step.enter.subscribe(() => {
            console.log("Enter event has been emitted from WizardStepComponent");
        }));
        // subscribe to exiting the dynamic step and push it to subscriptions array
        this.dynamicStepsSubscriptions.push(step.exit.subscribe(() => {
            console.log("Exit event has been emitted from WizardStepComponent");
        }));
    }

    public ngOnDestroy(): void {
        this.dynamicStepsSubscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
