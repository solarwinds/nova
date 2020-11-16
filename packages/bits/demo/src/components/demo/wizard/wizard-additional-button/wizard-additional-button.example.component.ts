import { Component, Inject } from "@angular/core";
import { ToastService } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-wizard-additional-button-example",
    templateUrl: "./wizard-additional-button.example.component.html",
})
export class WizardAdditionalButtonExampleComponent  {
    constructor(@Inject(ToastService) private toastService: ToastService) {}

    public onAdditionalButtonClick() {
        this.toastService.info({message: $localize `Additional button clicked!`});
    }
}
