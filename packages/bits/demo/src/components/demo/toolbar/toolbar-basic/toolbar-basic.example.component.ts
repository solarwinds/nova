import { Component, Inject } from "@angular/core";
import { IToastService, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-toolbar-basic-example",
    templateUrl: "./toolbar-basic.example.component.html",
})

export class ToolbarBasicExampleComponent {
    constructor(@Inject(ToastService) private toastService: IToastService) { }

    public onShowToast(highlightMode: boolean): void {
        this.toastService.info({
            message: $localize `Action done message!`,
            title: $localize `Action Done`,
        });
    }
}
