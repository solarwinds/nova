import { CdkStepper, STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { WizardDirective, WizardStepV2Component } from "@nova-ui/bits";
import { tap } from "rxjs/operators";

@Component({
    selector: "nui-wizard-custom",
    templateUrl: "wizard-custom.component.html",
    styleUrls: ["wizard-custom.component.less"],
    host: {
        "class": "nui-wizard-custom-layout",
        "aria-orientation": "horizontal",
    },
    providers: [
        { provide: WizardDirective, useExisting: WizardCustomComponent },
        { provide: CdkStepper, useExisting: WizardCustomComponent },
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardCustomComponent extends WizardDirective { }

@Component({
    selector: "nui-wizard-custom-example",
    templateUrl: "./wizard-custom.example.component.html",
    styleUrls: ["wizard-custom.component.less"],
    providers: [{
        provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false },
    }],
})
export class WizardCustomExampleComponent implements OnInit, AfterViewInit {
    public formGroup: FormGroup;
    public steps: number = 1;
    public selectedIndex: number = 0;
    public progress: number;

    @ViewChild("wizard") wizard: WizardCustomComponent;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            "personDetails": this.formBuilder.group({
                "name": ["", [Validators.required, Validators.minLength(3)]],
                "symptoms": [undefined, Validators.required],
            }),
            "diseaseDetails": this.formBuilder.group({
                "date": ["", Validators.required],
            }),
            "contactDetails": this.formBuilder.group({
                "email": ["", [Validators.required, Validators.email]],
                "phone": [""],
            }),
        });
    }

    ngAfterViewInit(): void {
        const update = (selectedIndex?: number, steps?: number) => {
            setTimeout(() => {
                if (steps) {
                    this.steps = steps;
                }
                if (selectedIndex !== undefined && selectedIndex >= 0) {
                    this.selectedIndex = selectedIndex;
                }
                this.progress = 100 * (1 + this.selectedIndex) / this.steps;
            });
        };

        this.wizard.selectionChange.pipe(
            tap(i => {
                update(i.selectedIndex);
            })
        ).subscribe();

        this.wizard.steps.changes.pipe(
            tap(c => {
                update(undefined, c.length);
            })
        ).subscribe();
    }

    validate(step: WizardStepV2Component): void {
        // mark all fields from current step as touched
        // in order to display the validation messages
        Object.keys((step.stepControl as FormGroup)?.controls || {})
            .forEach(key => {
                const field = this.wizard.selected.stepControl.get(key);
                field?.markAsTouched();
            });
    }
}
