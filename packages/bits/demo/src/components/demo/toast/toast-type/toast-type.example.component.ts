import { Component, Inject, OnInit } from "@angular/core";
import { IToastConfig, IToastService, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-toast-type-example",
    templateUrl: "./toast-type.example.component.html",
})
export class ToastTypeExampleComponent implements OnInit {
    constructor(@Inject(ToastService) private toastService: IToastService) {}

    ngOnInit() {
        this.toastService.setConfig({}, "id");
    }

    public onShowInfo(highlightMode: boolean): void {
        this.toastService.info({
            title: $localize`Info`,
            message: $localize`E pluribus unum (/ˈiː ˈplʊərɪbəs ˈjuːnəm/; Latin: [ˈeː ˈpluːrɪbʊs ˈuːnũː]) is Latin for 'Out of many, one'`,
            options: this.getOptions(),
        });
    }

    public onShowSuccess(highlightMode: boolean): void {
        this.toastService.success({
            title: $localize`Success`,
            message: $localize`Well done!`,
            options: this.getOptions(),
        });
    }

    public onShowWarning(highlightMode: boolean): void {
        this.toastService.warning({
            title: $localize`Warning`,
            message: $localize`There can be only one.`,
            options: this.getOptions(),
        });
    }

    public onShowError(highlightMode: boolean): void {
        this.toastService.error({
            title: $localize`Error`,
            message: $localize`Nope.`,
            options: this.getOptions(),
        });
    }

    public clear(): void {
        this.toastService.clear();
    }

    private getOptions(): IToastConfig {
        return {
            timeOut: 3000,
            extendedTimeOut: 1000,
        };
    }
}
