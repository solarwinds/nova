import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { IWizardSelectionEvent, WizardComponent, WizardStepComponent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "nui-wizard-steps-example",
    templateUrl: "./wizard-steps.example.component.html",
})
export class WizardStepsExampleComponent implements OnDestroy, OnInit {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;
    @ViewChild("dynamicStep") dynamicStep: WizardStepComponent;

    public selectedIndex: number;

    private destroy$ = new Subject();
    
    public myForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    public ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            name: this.formBuilder.control("",
                                           Validators.required),
            email: this.formBuilder.control("", [
                Validators.required,
                Validators.pattern("[^ @]*@[^ @]*"),
                Validators.email,
            ]),
            password: this.formBuilder.control("", [
                Validators.required,
                Validators.minLength(8),
            ]),
        });
    }

    public select(event: IWizardSelectionEvent): void {
        this.selectedIndex = event.selectedIndex;
    }

    public addStep(): void {
        // addStepDynamic returns an instance of WizardStepComponent that was dynamically added
        const step: WizardStepComponent = this.wizardComponent.addStepDynamic(this.dynamicStep, this.selectedIndex + 1);
        
        step.enter.pipe(takeUntil(this.destroy$))
            .subscribe(() => console.log(`Enter event has been emitted from WizardStepComponent`));

        step.exit.pipe(takeUntil(this.destroy$))
            .subscribe(() => console.log(`Exit event has been emitted from WizardStepComponent`));
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
