import { Component, Inject, OnInit } from "@angular/core";
import { IToastConfig, IToastService, ToastPositionClass, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-toast-visual",
    templateUrl: "./toast-visual-test.component.html",
})
export class ToastVisualTestComponent implements OnInit {

    private errorMessage: string = `Something went wrong + in addition there is an extremely
    long line that verifies that the toast expands as more text comes into it. More or less text -
    Toast messages must look good either way!`;

    constructor(@Inject(ToastService) private toastService: IToastService) { }

    ngOnInit(): void {
        this.toastService.setConfig({}, "id");
    }

    public showToastsAllPositions(highlightMode: boolean, timeout: number, progress: boolean = false): void {
        this.onShowInfo(highlightMode, timeout, progress, ToastPositionClass.TOP_LEFT);
        this.onShowError(highlightMode, timeout, progress, ToastPositionClass.TOP_RIGHT, "Error", this.errorMessage);
        this.onShowSuccess(highlightMode, timeout, progress, ToastPositionClass.BOTTOM_LEFT);
        this.onShowWarning(highlightMode, timeout, progress, ToastPositionClass.BOTTOM_RIGHT);
        this.onShowInfo(highlightMode, timeout, progress, ToastPositionClass.TOP_CENTER);
        this.onShowError(highlightMode, timeout, progress, ToastPositionClass.BOTTOM_CENTER);
    }

    public showToastsFullWidth(highlightMode: boolean, timeout: number, progress: boolean = false): void {
        this.onShowSuccess(highlightMode, timeout, progress, ToastPositionClass.TOP_FULL_WIDTH);
        this.onShowWarning(highlightMode, timeout, progress, ToastPositionClass.BOTTOM_FULL_WIDTH);
    }

    public showToastsAdjustSize(highlightMode: boolean, timeout: number, progress: boolean = false): void {
        this.onShowInfo(highlightMode, timeout, progress, ToastPositionClass.TOP_RIGHT);
        this.onShowSuccess(highlightMode, timeout, progress, ToastPositionClass.TOP_RIGHT);
        this.onShowWarning(highlightMode, timeout, progress, ToastPositionClass.TOP_RIGHT);
        this.onShowError(highlightMode, timeout, progress, ToastPositionClass.TOP_RIGHT, "Error", this.errorMessage);
    }

    public showToastsNoHeader(highlightMode: boolean, timeout: number, progress: boolean = false, header: string = ""): void {
        this.onShowInfo(highlightMode, timeout, progress, ToastPositionClass.TOP_RIGHT, header);
        this.onShowSuccess(highlightMode, timeout, progress, ToastPositionClass.TOP_RIGHT, header);
        this.onShowWarning(highlightMode, timeout, progress, ToastPositionClass.TOP_RIGHT, header);
        this.onShowError(highlightMode, timeout, progress, ToastPositionClass.TOP_RIGHT, header);
    }

    // eslint-disable-next-line max-len
    public onShowInfo(highlightMode: boolean, timeout: number, progress: boolean = false, position: ToastPositionClass, title: string = "Information", message: string = "Some info message"): void {
        this.toastService.info({
            title: title,
            message: `${message}`,
            options: this.getOptions(timeout, position, progress),
        });
    }

    // eslint-disable-next-line max-len
    public onShowError(highlightMode: boolean, timeout: number, progress: boolean = false, position: ToastPositionClass, title: string = "Failure!", message: string = "Something went wrong"): void {
        this.toastService.error({
            title: title,
            message: `${message}`,
            options: this.getOptions(timeout, position, progress),
        });
    }

    // eslint-disable-next-line max-len
    public onShowSuccess(highlightMode: boolean, timeout: number, progress: boolean = false, position: ToastPositionClass, title: string = "Well Done!", message: string = "You're great!"): void {
        this.toastService.success({
            title: title,
            message: `${message}`,
            options: this.getOptions(timeout, position, progress),
        });
    }

    // eslint-disable-next-line max-len
    public onShowWarning(highlightMode: boolean, timeout: number, progress: boolean = false, position: ToastPositionClass, title: string = "Attention!", message: string = "Pay attention!"): void {
        this.toastService.warning({
            title: title,
            message: `${message}`,
            options: this.getOptions(timeout, position, progress),
        });
    }

    public callStickyToast(highlightMode: boolean): void {
        this.toastService.error({
            title: "Failure",
            message: "This error is sticky!",
            options: { stickyError: true },
        });
    }

    public clearToast(highlightMode: boolean): void {
        this.toastService.clear();
    }

    private getOptions(timeout: number, position: ToastPositionClass, enableProgressBar: boolean = false): IToastConfig {
        return {
            timeOut: timeout,
            extendedTimeOut: 2000,
            positionClass: position,
            progressBar: enableProgressBar,
        };
    }
}
