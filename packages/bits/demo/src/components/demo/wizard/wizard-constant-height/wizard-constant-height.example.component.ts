import { Component } from "@angular/core";

@Component({
    selector: "nui-wizard-constant-height-example",
    templateUrl: "./wizard-constant-height.example.component.html",
})

export class WizardConstantHeightExampleComponent {
    public wizardBodyHeight: string = "200px";

    public increaseHeight(): void {
        this.wizardBodyHeight = `${parseInt(this.wizardBodyHeight, 10) + 20}px`;
    }

    public decreaseHeight(): void {
        this.wizardBodyHeight = `${parseInt(this.wizardBodyHeight, 10) - 20}px`;
    }
}
