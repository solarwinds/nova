import { fakeAsync, flush } from "@angular/core/testing";
import { Observable, of, Subject } from "rxjs";
import { take } from "rxjs/operators";

import { DashboardComponent } from "../components/dashboard/dashboard.component";
import { mockLoggerService } from "../mocks";

import { WidgetRemovalService } from "./widget-removal.service";

describe("WidgetRemovalService > ", () => {
    let service: WidgetRemovalService;
    const mockDashboardComponent = {
        removeWidget(widgetId: string) {},
    } as DashboardComponent;
    const testWidgetId = "testWidgetId";

    beforeEach(() => {
        service = new WidgetRemovalService(mockLoggerService);
    });

    describe("handleRemove > ", () => {
        it("should invoke WidgetRemovalOperation", () => {
            const tryRemoveSpy = jasmine
                .createSpy()
                .and.returnValue(of(testWidgetId));
            // @ts-ignore: Suppressed for test purposes
            service.handleRemove(
                mockDashboardComponent,
                testWidgetId,
                null,
                tryRemoveSpy
            );
            expect(tryRemoveSpy).toHaveBeenCalledWith(testWidgetId, null);
        });

        it("should not emit if the tryRemove results in an error", fakeAsync(() => {
            const tryRemove = (widgetId: string): Observable<string> => {
                const subject = new Subject<string>();
                setTimeout(() => {
                    subject.error("error text");
                });
                return subject.asObservable();
            };
            const spy = jasmine.createSpy();
            // @ts-ignore: Suppressed for test purposes
            const subscription = service
                .handleRemove(
                    mockDashboardComponent,
                    testWidgetId,
                    null,
                    tryRemove
                )
                .subscribe((value) => {
                    spy();
                });
            flush();
            expect(spy).not.toHaveBeenCalled();
            subscription.unsubscribe();
        }));

        it("should emit if the tryRemove succeeds", fakeAsync(() => {
            const tryRemove = (widgetId: string): Observable<string> => {
                const subject = new Subject<string>();
                setTimeout(() => {
                    subject.next(widgetId);
                });
                return subject.asObservable();
            };
            const spy = jasmine.createSpy();
            // @ts-ignore: Suppressed for test purposes
            service
                .handleRemove(
                    mockDashboardComponent,
                    testWidgetId,
                    null,
                    tryRemove
                )
                .pipe(take(1))
                .subscribe(() => {
                    spy();
                });
            flush();
            expect(spy).toHaveBeenCalled();
        }));

        it("should emit if the tryRemove is undefined", fakeAsync(() => {
            const spy = jasmine.createSpy();
            // @ts-ignore: Suppressed for test purposes
            service
                .handleRemove(mockDashboardComponent, testWidgetId, undefined)
                .pipe(take(1))
                .subscribe(() => {
                    spy();
                });
            flush();
            expect(spy).toHaveBeenCalled();
        }));

        it("should remove the widget from the dashboard", fakeAsync(() => {
            const tryRemove = (widgetId: string): Observable<string> => {
                const subject = new Subject<string>();
                setTimeout(() => {
                    subject.next(widgetId);
                });
                return subject.asObservable();
            };
            const spy = spyOn(mockDashboardComponent, "removeWidget");
            // @ts-ignore: Suppressed for test purposes
            service
                .handleRemove(
                    mockDashboardComponent,
                    testWidgetId,
                    null,
                    tryRemove
                )
                .pipe(take(1))
                .subscribe();
            flush();
            expect(spy).toHaveBeenCalled();
        }));
    });
});
