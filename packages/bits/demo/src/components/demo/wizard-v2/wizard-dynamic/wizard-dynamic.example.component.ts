import { AfterViewInit, Component, TemplateRef, ViewChild } from "@angular/core";
import { ToastService, WizardHorizontalComponent } from "@nova-ui/bits";

interface IWizardStepData {
    title: string;
    templateRef: TemplateRef<string>;
}

@Component({
    selector: "nui-wizard-dynamic-example",
    templateUrl: "./wizard-dynamic.example.component.html",
})
export class WizardDynamicExampleComponent implements AfterViewInit {
    public enableDynamicStepWithButton = false;
    public steps: IWizardStepData[] = [];

    @ViewChild("dynamicTemplate1") dynamicTemplate1: TemplateRef<string>;
    @ViewChild("wizardComponent") private wizard: WizardHorizontalComponent;

    constructor(private toastService: ToastService) {
    }

    public ngAfterViewInit(): void {
        this.addStep(this.dynamicTemplate1, $localize`My first dynamic step`);
    }

    public toggleStep(): void {
        this.enableDynamicStepWithButton = !this.enableDynamicStepWithButton;
    }

    public addStep(templateRef: TemplateRef<string>, title?: string): void {
        this.steps.push({ title: title ?? `Dynamic Step ${this.steps.length + 1}`, templateRef: templateRef });
    }

    public resetWizard(): void {
        this.wizard.reset();
    }

    public finishWizard(): void {
        this.toastService.success({
            title: $localize`Success`,
            message: $localize`Wizard has completed successfully`,
            options: {
                timeOut: 2000,
            },
        });
    }
}
