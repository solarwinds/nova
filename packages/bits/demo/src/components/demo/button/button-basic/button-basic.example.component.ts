import { Component, Inject } from "@angular/core";
import { ToastService } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-button-basic-example",
    templateUrl: "./button-basic.example.component.html",
})
export class ButtonBasicExampleComponent {
    constructor(@Inject(ToastService) private toastService: ToastService) {
    }

    onClick() {
        this.toastService.info({
            message: $localize `Button clicked!`,
            title: $localize `Event`,
        });
    }
}
