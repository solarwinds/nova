import { Component, Inject, OnInit } from "@angular/core";
import { IToastConfig, IToastService, ToastService } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-toast-basic-example",
    templateUrl: "./toast-basic.example.component.html",
})
export class ToastBasicExampleComponent implements OnInit {
    constructor(@Inject(ToastService) private toastService: IToastService) { }

    ngOnInit() {
        this.toastService.setConfig({}, "id");
    }

    public onShowToast(highlightMode: boolean): void {
        this.toastService.info({
            title: $localize `Simple Toast.`,
            message: $localize `Hi there! I'm a simple toast message`,
            options: this.getOptions(),
        });
    }

    private getOptions(): IToastConfig {
        return {
            timeOut: 5000,
            extendedTimeOut: 2000,
        };
    }
}
