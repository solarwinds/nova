import { Component, HostBinding, HostListener, NgZone, OnDestroy, ViewEncapsulation } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";
import { Subscription } from "rxjs";


import { IToastConfig } from "./public-api";
import { ToastPackage } from "./toast-package";
import { ToastServiceBase } from "./toast.servicebase";


enum ToastState {
    Inactive = "inactive",
    Active = "active",
    Removed = "removed",
}

// <example-url>./../examples/index.html#/toast</example-url>

/**
 * /**
 * __Name : __
 * Toast Component
 *
 * __Usage :__
 * Used to show toast, handle animation and events. Handles progress bar animation.
 * This component is created dynamically in ToastContainerService
*/
@Component({
    selector: "nui-toast-component",
    templateUrl: "./toast.component.html",
    styleUrls: ["./toast.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: { "[attr.role]": "role" },
})
export class ToastComponent implements OnDestroy {
    public body?: string | SafeHtml | null;
    public title?: string;
    public options: IToastConfig;
    /** width of progress bar */
    public width = -1;
    public toastIcon: string;
    public closeButton?: boolean;

    get role(): string { return this.toastPackage.toastType === "success" || this.toastPackage.toastType === "info" ? "status" : "alert"; }

    /** a combination of toast type and options.toastClass */
    @HostBinding("class") toastClasses = "";
    @HostBinding("class.nui-toast--fade-out") fadeOut = true;
    @HostBinding("style.display") display = "none";

    /** controls animation */
    private state: ToastState = ToastState.Inactive;
    private timeout: any;
    private intervalId: NodeJS.Timeout;
    private hideTime: number;
    private subscriptions: Array<Subscription> = [];
    private animationFadeOutLength = 1000;
    private toastTypeToSeverityIcon: { [key: string]: string } = {
        error: "severity_critical",
        warning: "severity_warning",
        info: "severity_info",
        success: "severity_ok",
    };

    constructor(private toastService: ToastServiceBase,
        private toastPackage: ToastPackage,
        private ngZone: NgZone) {
        this.title = toastPackage.title;
        this.body = toastPackage.body;
        this.options = toastPackage.config;
        this.toastClasses = `nui-toast--${toastPackage.toastType} ${toastPackage.config.toastClass} nui-toast--animation`;
        this.toastIcon = this.toastTypeToSeverityIcon[toastPackage.toastType];
        this.closeButton = this.toastPackage.config.closeButton;

        const activateSubscription = this.toastPackage.toastRef.afterActivate()
            .subscribe(() => {
                this.display = "block";
                setTimeout(() => this.activateToast()); // Is needed to make "display: none" & "opacity" transitions working
            });

        const closeSubscription = this.toastPackage.toastRef.manualClosed()
            .subscribe(() => {
                this.remove();
            });

        this.subscriptions.push(activateSubscription, closeSubscription);
    }

    /**
     * triggers fade in animation and sets timeout till the toast will be dismissed
     */
    public activateToast() {
        this.state = ToastState.Active;
        this.fadeOut = false;

        if (this.options.timeOut) {
            this.ngZone.runOutsideAngular(() => {
                this.timeout = setTimeout(() => {
                    this.ngZone.run(() => {
                        this.remove();
                    });
                }, this.options.timeOut);
            });
            this.hideTime = new Date().getTime() + this.options.timeOut;

            if (this.options.progressBar) {
                this.intervalId = this.repeatProgressBarChange();
            }
        }
    }

    /**
     * tells toastService to remove this toast after animation time
     */
    public remove() {
        if (this.state === ToastState.Removed) {
            return;
        }

        clearTimeout(this.timeout);
        this.state = ToastState.Removed;
        this.fadeOut = true;
        this.timeout = setTimeout(() => this.toastService.remove(this.toastPackage.toastId), this.animationFadeOutLength);
    }

    /**
     * handles click on toast itself
     */
    @HostListener("click")
    public clickToast() {
        if (this.state === ToastState.Removed) {
            return;
        }

        this.toastPackage.triggerClick();

        if (this.options.clickToDismiss) {
            this.remove();
        }
    }

    /**
     * disables progressBar and prevents toast from closing
     */
    @HostListener("mouseenter")
    public stickAround() {
        if (this.state === ToastState.Removed) {
            return;
        }

        clearTimeout(this.timeout);
        this.options.timeOut = 0;
        this.hideTime = 0;
        // disable progressBar
        clearInterval(this.intervalId);
        this.width = 0;
    }

    /**
     *  using extendedTimeOut value to delay toast's closure
     */
    @HostListener("mouseleave")
    public delayedHideToast() {
        clearInterval(this.intervalId);

        if (this.options.extendedTimeOut === 0 || this.state === ToastState.Removed) {
            return;
        }

        this.timeout = setTimeout(() => this.remove(), this.options.extendedTimeOut);
        this.options.timeOut = this.options.extendedTimeOut;
        this.hideTime = new Date().getTime() + (this.options.timeOut || 0);
        this.width = 100;

        if (this.options.progressBar) {
            this.intervalId = this.repeatProgressBarChange();
        }
    }

    private repeatProgressBarChange(): NodeJS.Timeout {
        let intervalId;

        this.ngZone.runOutsideAngular(() => {
            intervalId = setInterval(() => {
                this.ngZone.run(() => {
                    this.updateProgress();
                });
            }, (this.options.timeOut || 0) / 100);
        });

        // using type assertion to avoid compile time error
        // variable intervalId is assigned by clojure / async
        return intervalId as unknown as NodeJS.Timeout;
    }

    /**
     * updates progress bar width
     */
    private updateProgress() {
        if (this.width === 0 || !this.options.timeOut) {
            return;
        }

        const now = new Date().getTime();
        const remaining = this.hideTime - now;

        this.width = (remaining / this.options.timeOut) * 100;

        if (this.options.progressAnimation === "increasing") {
            this.width = 100 - this.width;
        }

        if (this.width <= 0) {
            this.width = 0;
        }

        if (this.width >= 100) {
            this.width = 100;
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        clearInterval(this.intervalId);
        clearTimeout(this.timeout);
    }
}
