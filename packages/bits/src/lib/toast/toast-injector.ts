import { Injector, Type } from "@angular/core";

import { ToastPackage } from "./toast-package";

/** Custom injector type specifically for instantiating components with a toast. */
/**@ignore*/
export class ToastInjector implements Injector {
    constructor(private toastPackage: ToastPackage,
                private parentInjector: Injector) { }

    public get(token: any, notFoundValue?: any): any {
        if (token === ToastPackage && this.toastPackage) {
            return this.toastPackage;
        }

        return this.parentInjector.get<ToastPackage>(token as Type<ToastPackage>, notFoundValue);
    }
}
