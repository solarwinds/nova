import { Component, Inject, OnInit } from "@angular/core";
import { IActiveToast, IToastConfig, IToastService, ToastPositionClass, ToastService } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-toast-events-example",
    templateUrl: "./toast-events.example.component.html",
})

export class ToastEventsExampleComponent implements OnInit {
    public lastShown?: number;
    public clickCount = 0;
    public toastCount = 0;
    public isDisplayed: boolean;

    constructor(@Inject(ToastService) private toastService: IToastService) { }

    ngOnInit() {
        this.toastService.setConfig({}, "id");
    }

    public onShowToast(highlightMode: boolean): void {
        const toastInstance: IActiveToast = this.toastService.info({
            title: $localize `Toast Events`,
            message: $localize `Click Me!`,
            options: this.getOptions(),
        });
        toastInstance.onShown?.subscribe(() => {
            ++this.toastCount;
            this.isDisplayed = true;
            this.lastShown = toastInstance.toastId;
        });

        toastInstance.onClick?.subscribe(() => {
            ++this.clickCount;
        });

        toastInstance.onHidden?.subscribe(() => {
            --this.toastCount;
            this.isDisplayed = this.toastCount > 0;
        });
    }

    private getOptions(): IToastConfig {
        return {
            extendedTimeOut: 5000,
            clickToDismiss: false,
            closeButton: false,
            positionClass: ToastPositionClass.TOP_RIGHT,
            progressBar: true,
            progressAnimation: "increasing",
            timeOut: 10000,
        };
    }
}
