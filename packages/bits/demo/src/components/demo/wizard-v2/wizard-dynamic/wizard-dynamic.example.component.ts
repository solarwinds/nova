import {AfterViewInit, Component, TemplateRef, ViewChild} from "@angular/core";

interface IWizardStepConfig {
    title: string;
    templateRef: TemplateRef<string>;
}

@Component({
    selector: "nui-wizard-dynamic-example",
    templateUrl: "./wizard-dynamic.example.component.html",
})
export class WizardDynamicExampleComponent implements AfterViewInit {
    public enableDynamicStepWithButton = false;
    public steps: IWizardStepConfig[] = [];

    @ViewChild("dynamicTemplate1") dynamicTemplate1: TemplateRef<string>;

    public ngAfterViewInit(): void {
        this.addStep(this.dynamicTemplate1, $localize `My first dynamic step`);
    }

    public toggleStep() {
        this.enableDynamicStepWithButton = !this.enableDynamicStepWithButton;
    }

    public addStep(templateRef: TemplateRef<string>, title?: string) {
        this.steps.push({title: title ?? `Dynamic Step ${this.steps.length + 1}`, templateRef: templateRef});
    }
}
