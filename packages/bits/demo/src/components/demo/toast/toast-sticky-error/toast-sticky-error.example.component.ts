import { Component, Inject, OnInit } from "@angular/core";

import {
    IToastConfig,
    IToastService,
    ToastPositionClass,
    ToastService,
} from "@nova-ui/bits";

@Component({
    selector: "nui-toast-sticky-error-example",
    templateUrl: "./toast-sticky-error.example.component.html",
})
export class ToastStickyErrorExampleComponent implements OnInit {
    public selectedPosition: string;

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    ngOnInit() {
        this.toastService.setConfig({}, "id");
    }

    public onShowStickyError(highlightMode: boolean): void {
        this.toastService.error({
            title: $localize`Sticky Error`,
            message: $localize`Red Alert`,
            options: this.getOptions(),
        });
    }

    public onHideStickyError(highlightMode: boolean): void {
        this.toastService.clear();
    }

    private getOptions(): IToastConfig {
        return {
            clickToDismiss: false,
            closeButton: false,
            positionClass: ToastPositionClass.TOP_RIGHT,
            stickyError: true,
        };
    }
}
