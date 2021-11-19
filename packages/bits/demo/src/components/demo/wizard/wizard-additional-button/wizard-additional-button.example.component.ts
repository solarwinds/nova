import { Component, Inject } from "@angular/core";
import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-additional-button-example",
    templateUrl: "./wizard-additional-button.example.component.html",
})
export class WizardAdditionalButtonExampleComponent {
    constructor(@Inject(ToastService) private toastService: ToastService) { }

    public onAdditionalButtonClick(): void {
        this.toastService.info({ message: $localize`Additional button clicked!` });
    }
}
