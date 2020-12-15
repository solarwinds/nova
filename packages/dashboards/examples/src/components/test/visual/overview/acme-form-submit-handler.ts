import { Injectable } from "@angular/core";
import { ToastService } from "@nova-ui/bits";
import { IConfiguratorSource, IDashboardPersistenceHandler, IWidget } from "@nova-ui/dashboards";
import { Observable, Subject } from "rxjs";

@Injectable()
export class AcmeFormSubmitHandler implements IDashboardPersistenceHandler {
    public allowSubmit = true;
    public allowRemoval = true;

    constructor(private toastService: ToastService) {
        this.toastService.setConfig({
            timeOut: 2000,
        });
    }

    public trySubmit = (widget: IWidget, source: IConfiguratorSource): Observable<IWidget> => {
        const subject = new Subject<IWidget>();

        setTimeout(() => {
            if (this.allowSubmit) {
                subject.next(widget);
            } else {
                const error = $localize `Submit failed.`;
                this.toastService.error({ title: error });
                subject.error(error);
            }
        }, 1000);

        return subject.asObservable();
    }

    public tryRemove = (widgetId: string): Observable<string> => {
        const subject = new Subject<string>();

        setTimeout(() => {
            if (this.allowRemoval) {
                subject.next(widgetId);
            } else {
                const error = $localize `Widget removal failed.`;
                this.toastService.error({ title: error });
                subject.error(error);
            }
        }, 200);

        return subject.asObservable();
    }
}
