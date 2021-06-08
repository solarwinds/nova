import {
    AfterViewInit,
    Component,
    TemplateRef,
    ViewChild,
} from "@angular/core";

import {IWizardStepV2Component } from "../wizard-dynamic/wizard-dynamic.example.component";

@Component({
    selector: "nui-wizard-remove-step-example",
    templateUrl: "./wizard-remove-step-example.component.html",
})
export class WizardRemoveStepExampleComponent implements AfterViewInit {
    public steps: IWizardStepV2Component[] = [];

    @ViewChild("normalStep") normalStep: TemplateRef<string>;

    public ngAfterViewInit(): void {
        this.addStep(this.normalStep, $localize `Normal step`);
    }

    public addStep(templateRef: TemplateRef<string>, title?: string) {
        this.steps.push({title: title ?? `Dynamic Step`, templateRef: templateRef});
    }

    public removeStep(index: number): void {
        this.steps.splice(index, 1);
    }
}
