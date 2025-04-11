// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { fakeAsync, flush } from "@angular/core/testing";
import { Observable, of, Subject } from "rxjs";
import { take } from "rxjs/operators";

import { DashboardComponent } from "../components/dashboard/dashboard.component";
import { mockLoggerService } from "../mocks.spec";
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
            service.handleRemove(
                mockDashboardComponent,
                testWidgetId,
                // @ts-ignore: Suppressed for test purposes
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
            const subscription = service
                .handleRemove(
                    mockDashboardComponent,
                    testWidgetId,
                    // @ts-ignore: Suppressed for test purposes
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
            service
                .handleRemove(
                    mockDashboardComponent,
                    testWidgetId,
                    // @ts-ignore: Suppressed for test purposes
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
            service
                // @ts-ignore: Suppressed for test purposes
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
            service
                .handleRemove(
                    mockDashboardComponent,
                    testWidgetId,
                    // @ts-ignore: Suppressed for test purposes
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
