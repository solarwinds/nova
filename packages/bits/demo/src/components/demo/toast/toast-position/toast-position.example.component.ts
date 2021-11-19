import { Component, Inject, OnInit } from "@angular/core";
import { IToastConfig, IToastService, ToastPositionClass, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-toast-position-example",
    templateUrl: "./toast-position.example.component.html",
})
export class ToastPositionExampleComponent implements OnInit {
    public toastPositions = [
        {
            displayValue: $localize`Top Right`,
            className: ToastPositionClass.TOP_RIGHT,
        },
        {
            displayValue: $localize`Top Left`,
            className: ToastPositionClass.TOP_LEFT,
        },
        {
            displayValue: $localize`Bottom Right`,
            className: ToastPositionClass.BOTTOM_RIGHT,
        },
        {
            displayValue: $localize`Bottom Left`,
            className: ToastPositionClass.BOTTOM_LEFT,
        },
        {
            displayValue: $localize`Top Full Width`,
            className: ToastPositionClass.TOP_FULL_WIDTH,
        },
        {
            displayValue: $localize`Bottom Full Width`,
            className: ToastPositionClass.BOTTOM_FULL_WIDTH,
        },
        {
            displayValue: $localize`Top Center`,
            className: ToastPositionClass.TOP_CENTER,
        },
        {
            displayValue: $localize`Bottom Center`,
            className: ToastPositionClass.BOTTOM_CENTER,
        },
        {
            displayValue: $localize`CUSTOM CLASS (top: 200px; right: 200px)`,
            className: "demoToastCustomClass",
        },
    ];
    public selectedPosition: ToastPositionClass | string = this.toastPositions[0].className;

    constructor(@Inject(ToastService) private toastService: IToastService) { }

    ngOnInit(): void {
        this.toastService.setConfig({}, "id");
    }

    public onShowToast(highlightMode: boolean): void {
        this.toastService.info({
            title: $localize`Position Example`,
            message: this.selectedPosition,
            options: this.getOptions(),
        });
    }

    private getOptions(): IToastConfig {
        return {
            timeOut: 5000,
            extendedTimeOut: 2000,
            positionClass: this.selectedPosition,
        };
    }
}
