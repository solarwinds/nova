import { Component, OnDestroy, ViewChild } from "@angular/core";
import { IWizardSelectionEvent, WizardComponent, WizardStepComponent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "nui-wizard-dynamic-remove-example",
    templateUrl: "./wizard-dynamic-remove.example.component.html",
})
export class WizardDynamicRemoveExampleComponent implements OnDestroy {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("dynamicStep") dynamicStep: WizardStepComponent;

    public selectedIndex: number;

    private destroy$ = new Subject();

    public select(event: IWizardSelectionEvent): void {
        this.selectedIndex = event.selectedIndex;
    }

    public addStep(): void {
        const index = this.selectedIndex + 1;
        const step: WizardStepComponent = this.wizardComponent.addStepDynamic(this.dynamicStep, index);

        step.enter.pipe(takeUntil(this.destroy$))
            .subscribe(() => console.log(`Enter event has been emitted from WizardStepComponent`));

        step.exit.pipe(takeUntil(this.destroy$))
            .subscribe(() => console.log(`Exit event has been emitted from WizardStepComponent`));
    }

    public removeStep(index: number): void {
        this.wizardComponent.removeStep(index);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
