import {Injectable, Injector, SecurityContext} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import _assign from "lodash/assign";
import _cloneDeep from "lodash/cloneDeep";
import _isArray from "lodash/isArray";
import _toInteger from "lodash/toInteger";
import {take} from "rxjs/operators";

import {SwitchState} from "../../services/notification-args";
import {NotificationService} from "../../services/notification-service";

import {IActiveToast, IToastConfig, IToastDeclaration, IToastService, ToastPositionClass} from "./public-api";
import {ToastContainerService} from "./toast-container.service";
import {ToastInjector} from "./toast-injector";
import {ToastPackage} from "./toast-package";
import {ToastRef} from "./toast-ref";
import {ToastComponent} from "./toast.component";

/**
 * __Name : __
 * Toast Service
 *
 * __Usage :__
 * Used to show toast messages and to trigger highlight of items
 */
/**
 * @ignore
 */
@Injectable({providedIn: "root"})
export class ToastService implements IToastService {
    private index = 0;
    private currentlyActive = 0;
    private toasts: IActiveToast[] = [];
    private defaultToastConfig: IToastConfig = {
        maxOpened: 0,
        autoDismiss: false,
        newestOnTop: true,
        preventDuplicates: false,
        positionClass: ToastPositionClass.TOP_RIGHT,
        progressAnimation: "decreasing",
        timeOut: 5000,
        progressBar: true,
        toastClass: "nui-toast",
        extendedTimeOut: 2000,
        closeButton: true,
        clickToDismiss: false,
        enableHtml: true,
        stickyError: false,
    };
    private toastConfig: IToastConfig;
    private itemIdentificator: string | undefined;

    constructor(private notificationService: NotificationService,
                private toastContainerService: ToastContainerService,
                private _injector: Injector,
                private sanitizer: DomSanitizer) {
        this.toastConfig = _assign({}, this.defaultToastConfig);
    }

    /**
     *
     * __Description:__ set global config for all kind of toasts and itemIdentificator that is
     * used for identification of item in nuiToast directive
     * @param config
     * @param itemIdentificator
     * @return void
     */
    public setConfig(config: IToastConfig, itemIdentificator?: string): void {
        _assign(this.toastConfig, config);
        this.itemIdentificator = itemIdentificator;
    }

    /**
     *
     * __Description:__ show success toast trigger highlight of items and trigger fade out of highlighting when
     * toast is gone
     *
     * @param toastDeclaration
     * @return void
     */
    public success(toastDeclaration: IToastDeclaration): IActiveToast {
        const toastInstance = this.buildNotification("success", toastDeclaration.message, toastDeclaration.title, this.applyConfig(toastDeclaration.options));
        this.notifyHighlights(toastDeclaration.itemsToHighlight, "success");
        this.toastRemoveHighlight(toastInstance, toastDeclaration.itemsToHighlight);
        return toastInstance;
    }

    public warning(toastDeclaration: IToastDeclaration): IActiveToast {
        const toastInstance = this.buildNotification("warning", toastDeclaration.message, toastDeclaration.title, this.applyConfig(toastDeclaration.options));
        this.notifyHighlights(toastDeclaration.itemsToHighlight, "warning");
        this.toastRemoveHighlight(toastInstance, toastDeclaration.itemsToHighlight);
        return toastInstance;
    }

    public error(toastDeclaration: IToastDeclaration): IActiveToast {
        const config = _cloneDeep(toastDeclaration.options);

        if (toastDeclaration.options && toastDeclaration.options.stickyError && config) {
            config.timeOut = 0;
            config.extendedTimeOut = 0;
            config.progressBar = false;
            config.closeButton = false;
        }

        const toastInstance = this.buildNotification("error", toastDeclaration.message, toastDeclaration.title, this.applyConfig(config));
        this.notifyHighlights(toastDeclaration.itemsToHighlight, "error");
        this.toastRemoveHighlight(toastInstance, toastDeclaration.itemsToHighlight);
        return toastInstance;
    }

    public info(toastDeclaration: IToastDeclaration): IActiveToast {
        const toastInstance = this.buildNotification("info", toastDeclaration.message, toastDeclaration.title, this.applyConfig(toastDeclaration.options));
        this.notifyHighlights(toastDeclaration.itemsToHighlight, "info");
        this.toastRemoveHighlight(toastInstance, toastDeclaration.itemsToHighlight);
        return toastInstance;
    }

    /**
     *
     * __Description:__ calls toasts' close methods to close them
     *
     * @param toastId
     * @return void
     */
    public clear(toastId?: number) {
        for (const toast of this.toasts) {
            if (toastId !== undefined) {
                if (toast.toastId === toastId) {
                    toast.toastRef.manualClose();
                    return;
                }
            } else {
                toast.toastRef.manualClose();
            }
        }
    }

    /**
     *
     * __Description:__ removes toast by id and activates next toast in queue (when maxOpened !== 0)
     *
     * @param toastId
     * @return boolean
     */
    public remove(toastId: number): boolean {
        const toastInstance = this.findToast(toastId);

        if (!toastInstance) {
            return false;
        }

        toastInstance.activeToast.toastRef.close();
        this.toasts.splice(toastInstance.index, 1);
        this.currentlyActive = this.currentlyActive - 1;

        if (!this.toastConfig.maxOpened || !this.toasts.length) {
            return false;
        }

        if (this.currentlyActive <= +this.toastConfig.maxOpened && this.toasts[this.currentlyActive]) {
            const activeToastRef = this.toasts[this.currentlyActive].toastRef;
            if (!activeToastRef.isInactive()) {
                this.currentlyActive = this.currentlyActive + 1;
                activeToastRef.activate();
            }
        }

        return true;
    }

    private toastRemoveHighlight(toastInstance: IActiveToast | null, itemsToRemoveHighlight?: any[]): void {
        if (toastInstance) {
            toastInstance?.onHidden?.pipe(take(1))
                .subscribe(() => {
                    if (_isArray(itemsToRemoveHighlight) && itemsToRemoveHighlight.length > 0) {
                        this.notificationService.post("Highlight", {
                            highlightState: SwitchState.off,
                            items: itemsToRemoveHighlight,
                        });
                    }
                });
        }
    }

    private applyConfig(override: IToastConfig = {}): IToastConfig {
        const resultConfig = _assign({}, this.toastConfig, override);
        resultConfig.timeOut = _toInteger(resultConfig.timeOut);
        resultConfig.extendedTimeOut = _toInteger(resultConfig.extendedTimeOut);
        return resultConfig;
    }

    private buildNotification(toastType: string,
                              body: string | undefined,
                              title: string | undefined,
                              config: IToastConfig): IActiveToast {

        // max opened and auto dismiss = true
        if (body && config.preventDuplicates && this.isDuplicate(body)) {
            // TODO: Update buildNotification return type in V10
            // @ts-ignore: Suppressing error until v10 to prevent API breaking changes
            return null;
        }

        const toastContainer = this.toastContainerService.getContainerElement(config.positionClass);
        let keepInactive = false;
        let sanitizedBody: string | undefined = body;
        let toastRef: ToastRef<ToastComponent>;
        let toastPackage: ToastPackage;
        let toastInjector: ToastInjector;
        let toastInstance: IActiveToast;

        if (this.toastConfig.maxOpened && this.currentlyActive >= this.toastConfig.maxOpened) {
            keepInactive = true;
            if (this.toastConfig.autoDismiss) {
                this.clear(this.toasts[this.toasts.length - 1].toastId);
            }
        }

        this.index = this.index + 1;

        if (body && config.enableHtml) {
            sanitizedBody = <string>this.sanitizer.sanitize(SecurityContext.HTML, body);
        }

        toastRef = new ToastRef(this.toastContainerService);
        toastPackage = new ToastPackage(
            this.index,
            config,
            sanitizedBody,
            title,
            toastType,
            toastRef
        );
        toastInjector = new ToastInjector(toastPackage, this._injector);
        toastRef.componentInstance = this.toastContainerService.attachToast(ToastComponent, toastInjector, !!config.newestOnTop);
        toastInstance = {
            toastId: this.index,
            body: sanitizedBody,
            toastRef,
            onShown: toastRef.afterActivate(),
            onHidden: toastRef.afterClosed(),
            onClick: toastPackage.onClick(),
        };

        if (!keepInactive) {
            setTimeout(() => {
                toastInstance.toastRef.activate();
                this.currentlyActive = this.currentlyActive + 1;
            });
        }

        this.toasts.push(toastInstance);
        return toastInstance;
    }

    /**
     * Determines if toast message is already shown
     */
    private isDuplicate(body: string) {
        for (let i = 0; i < this.toasts.length; i++) {
            if (this.toasts[i].body === body) {
                return true;
            }
        }

        return false;
    }

    private findToast(toastId: number): { index: number, activeToast: IActiveToast } | null {
        for (let i = 0; i < this.toasts.length; i++) {
            if (this.toasts[i].toastId === toastId) {
                return { index: i, activeToast: this.toasts[i] };
            }
        }

        return null;
    }

    private notifyHighlights = (itemsToHighlight: any[] | null | undefined, status: string): void => {
        if (itemsToHighlight) {
            this.notificationService.post("Highlight", {
                highlightState: SwitchState.on,
                status: status,
                items: itemsToHighlight,
                itemIdentificator: this.itemIdentificator,
            });
        }
    }
}
