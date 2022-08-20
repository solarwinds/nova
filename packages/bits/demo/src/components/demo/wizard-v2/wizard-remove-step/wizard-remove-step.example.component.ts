import {
    AfterViewInit,
    Component,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { ToastService, WizardHorizontalComponent } from "@nova-ui/bits";

interface IWizardStepData {
    title: string;
    templateRef: TemplateRef<string>;
}

@Component({
    selector: "nui-wizard-remove-step-example",
    templateUrl: "./wizard-remove-step.example.component.html",
})
export class WizardRemoveStepExampleComponent implements AfterViewInit {
    public steps: IWizardStepData[] = [];

    @ViewChild("normalStep") normalStep: TemplateRef<string>;
    @ViewChild("wizard") private wizard: WizardHorizontalComponent;

    constructor(private toastService: ToastService) {}

    public ngAfterViewInit(): void {
        this.addStep(this.normalStep, $localize`Normal step`);
    }

    public addStep(templateRef: TemplateRef<string>, title?: string): void {
        this.steps.push({
            title: title ?? `Dynamic Step`,
            templateRef: templateRef,
        });
    }

    public removeStep(index: number): void {
        this.steps.splice(index, 1);
    }

    public resetWizard(): void {
        this.wizard.reset();
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
