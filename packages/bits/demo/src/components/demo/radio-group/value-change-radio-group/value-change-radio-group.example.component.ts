import { Component, Inject } from "@angular/core";
import { IToastService, ToastService } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-value-change-radio-group-example",
    templateUrl: "./value-change-radio-group.example.component.html",
})
export class ValueChangeRadioGroupExampleComponent {
    public colors = [$localize `Red`, $localize `Green`, $localize `Blue`];
    public colorHints = { "Red": $localize `hot color`, "Green": $localize `color of nature`, "Blue": $localize `color of sky` };
    public selectedColor: string;

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    public showSelected() {
        this.toastService.success({
            message: $localize `You selected ${this.selectedColor}. Nice!`,
        });
    }
}
