import { Component, OnInit, ViewChild } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { of } from "rxjs";
import { delay, take } from "rxjs/operators";
import {
    ToastService,
    WizardHorizontalComponent,
    WizardStepV2Component,
} from "@nova-ui/bits";

const fakeAsyncValidator = (c: FormControl) => of(null).pipe(delay(4000));

@Component({
    selector: "nui-wizard-async-form-validation-example",
    templateUrl: "./wizard-async-form-validation.example.component.html",
})
export class WizardAsyncFormValidationExampleComponent implements OnInit {
    public busy: boolean;
    public form: FormGroup;

    @ViewChild("wizard") wizard: WizardHorizontalComponent;

    constructor(
        private formBuilder: FormBuilder,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            personDetails: this.formBuilder.group({
                name: [
                    "",
                    [Validators.required, Validators.minLength(3)],
                    [fakeAsyncValidator],
                ],
            }),
            contactDetails: this.formBuilder.group({
                email: ["", [Validators.required, Validators.email]],
                phone: [""],
            }),
        });
    }

    public onNextClick(selected: WizardStepV2Component): void {
        const { stepControl } = selected;

        if (stepControl.status !== "PENDING") {
            stepControl.markAllAsTouched();

            return;
        }

        this.busy = true;
        stepControl.statusChanges.pipe(take(1)).subscribe((status) => {
            if (status === "VALID") {
                this.wizard.next();
                this.busy = false;
            }
        });
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

    public resetWizard(): void {
        this.wizard.reset();
    }
}
