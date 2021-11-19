import { Observable, Subject } from "rxjs";

import { IToastRef } from "./public-api";
import { ToastContainerService } from "./toast-container.service";

/**
 * Reference to a toast opened via the Toast service.
 * Used to provide toast events hooks
 */
/** @ignore */
export class ToastRef<T> implements IToastRef<T> {
    /** The instance of component opened into the toast. */
    public componentInstance: T;
    /** Subject for notifying user, that the toast has finished closing. */
    private afterClosedSubject: Subject<any> = new Subject();
    private activateSubject: Subject<any> = new Subject();
    private manualCloseSubject: Subject<any> = new Subject();

    constructor(private toastContainerService: ToastContainerService) { }

    public manualClose(): void {
        this.manualCloseSubject.next();
        this.manualCloseSubject.complete();
    }

    public manualClosed(): Observable<any> {
        return this.manualCloseSubject.asObservable();
    }

    /**
     * Close toast
     */
    public close(): void {
        this.toastContainerService.detachToast(this.componentInstance);
        this.afterClosedSubject.next();
        this.afterClosedSubject.complete();
    }

    /** Gets an observable that is notified when the toast has finished closing. */
    public afterClosed(): Observable<any> {
        return this.afterClosedSubject.asObservable();
    }

    public isInactive(): boolean {
        return this.activateSubject.isStopped;
    }

    public activate(): void {
        this.activateSubject.next();
        this.activateSubject.complete();
    }

    /** Gets an observable that is notified when the toast has started opening. */
    public afterActivate(): Observable<any> {
        return this.activateSubject.asObservable();
    }
}
