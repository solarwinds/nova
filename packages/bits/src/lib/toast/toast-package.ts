import { SafeHtml } from "@angular/platform-browser";
import { Observable, Subject } from "rxjs";

import { IToastConfig } from "./public-api";
import { ToastRef } from "./toast-ref";

/**
 * __Description:__ Represents metadata of a toast.
 * Used as an injectable entity, that injects into a toast component.
 */
/** @ignore */
export class ToastPackage {
    private onClickSubject: Subject<any> = new Subject();

    constructor(public toastId: number,
                public config: IToastConfig,
                public body: string | SafeHtml | undefined,
                public title: string | undefined,
                public toastType: string,
                public toastRef: ToastRef<any>) { }

    /** Fires after clicking on toast */
    public triggerClick(): void {
        this.onClickSubject.next();
    }

    public onClick(): Observable<any> {
        return this.onClickSubject.asObservable();
    }

}
