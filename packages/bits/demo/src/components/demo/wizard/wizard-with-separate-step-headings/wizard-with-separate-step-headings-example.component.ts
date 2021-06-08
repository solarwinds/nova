import { Component } from "@angular/core";

@Component({
    selector: "nui-wizard-with-separate-step-headings-example",
    templateUrl: "./wizard-with-separate-step-headings-example.component.html",
})
export class WizardWithSeparateStepHeadingsExampleComponent {
    public hint = $localize `example-hint`;

    public onOptionChange(value: string) {
        this.hint = value;
    }
}
