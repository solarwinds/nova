import { Component } from "@angular/core";

@Component({
    selector: "nui-wizard-with-separate-step-headings-example",
    templateUrl: "./wizard-with-separate-step-headings-example.component.html",
})
export class WizardWithSeparateStepHeadingsExampleComponent {
    public textboxValue = "Example Textbox Value";

    public onTextboxChange(value: string) {
        this.textboxValue = value;
    }
}
