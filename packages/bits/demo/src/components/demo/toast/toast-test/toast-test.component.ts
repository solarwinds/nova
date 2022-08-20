import { Component, Inject, OnInit } from "@angular/core";
import {
    IActiveToast,
    IToastConfig,
    IToastDeclaration,
    IToastService,
    ToastPositionClass,
    ToastService,
} from "@nova-ui/bits";

@Component({
    selector: "nui-toast-test",
    templateUrl: "./toast-test.component.html",
})
export class ToastTestComponent implements OnInit {
    constructor(@Inject(ToastService) private toastService: IToastService) {}

    private defaults: IToastDeclaration = {
        message: "",
        title: "",
        options: {
            timeOut: 5000,
            extendedTimeOut: 2000,
            closeButton: true,
            progressBar: true,
            progressAnimation: "decreasing",
            toastClass: "nui-toast",
            positionClass: ToastPositionClass.TOP_RIGHT,
            maxOpened: 0, // unlimited
            newestOnTop: true,
            enableHtml: false,
        },
    };
    // Using intersection type to avoid adding optional chaining operator (?) multiple times in template
    // because options property is optional.
    public toast: IToastDeclaration & { options: IToastConfig };
    public count: number;
    public type: string;

    ngOnInit() {
        this.reset();
    }

    public fireToast() {
        const funcs: Record<
            string,
            (toast: IToastDeclaration) => IActiveToast
        > = {
            error: (toast) => this.toastService.error(toast),
            info: (toast) => this.toastService.info(toast),
            success: (toast) => this.toastService.success(toast),
            warning: (toast) => this.toastService.warning(toast),
        };

        for (let i = 0; i < this.count; i++) {
            funcs[this.type](this.toast);
        }
    }

    public reset() {
        this.count = 1;
        this.type = "info";
        this.toast = {
            ...this.defaults,
            options: { ...this.defaults.options },
        };
        this.toastService.clear();
    }
}
