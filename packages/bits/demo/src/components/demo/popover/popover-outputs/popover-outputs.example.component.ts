import { Component, Inject } from "@angular/core";
import { IToastService, ToastService } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-popover-outputs-example",
    templateUrl: "./popover-outputs.example.component.html",
})
export class PopoverOutputsExampleComponent {
    constructor(@Inject(ToastService) private toastService: IToastService) {
    }

    public onHide(): void {
        this.toastService.success({message: $localize `onHide was invoked`});
    }

    public onShow(): void {
        this.toastService.success({message: $localize `onShow was invoked`});
    }
}
