import {
    AfterViewInit,
    Component,
    TemplateRef,
    ViewChild,
} from "@angular/core";

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
