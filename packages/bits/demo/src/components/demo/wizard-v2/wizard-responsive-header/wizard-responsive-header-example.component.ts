import { Component } from "@angular/core";
@Component({
    selector: "nui-wizard-responsive-header-example",
    templateUrl: "./wizard-responsive-header-example.component.html",
})
export class WizardResponsiveHeaderExampleComponent {
    public steps: Array<any> = Array.from({length: 20});

}
