import { Component, Inject, OnInit } from "@angular/core";

import {
    IToastConfig,
    IToastService,
    ToastPositionClass,
    ToastService,
} from "@nova-ui/bits";

@Component({
    selector: "nui-toast-config-example",
    templateUrl: "./toast-config.example.component.html",
})
export class ToastConfigExampleComponent implements OnInit {
    public selectedPosition: string;

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    ngOnInit() {
        this.toastService.setConfig({}, "id");
    }

    public onShowToast(highlightMode: boolean): void {
        this.toastService.info({
            title: $localize`Toast Configuration`,
            message: $localize`I'm pretty easy to configure`,
            options: this.getOptions(),
        });
    }

    private getOptions(): IToastConfig {
        return {
            extendedTimeOut: 2000,
            clickToDismiss: true,
            closeButton: true,
            positionClass: ToastPositionClass.BOTTOM_RIGHT,
            progressBar: true,
            progressAnimation: "increasing",
            timeOut: 5000,
        };
    }
}
