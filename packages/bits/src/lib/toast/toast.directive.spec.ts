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

import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import _find from "lodash/find";

import { ToastDirective } from "./toast.directive";
import { ToastService } from "./toast.service";
import { SwitchState } from "../../services/notification-args";
import NotificationService from "../../services/notification-service";
import { INotificationService } from "../../services/public-api";

@Component({
    template: `<div [nuiToast]="model"></div>`,
    standalone: false,
})
class ToastTestingComponent {
    public model = {
        id: "testId",
    };
}

describe("directives >", () => {
    describe("toast >", () => {
        const successStatus = "success";
        const highlightOnClass = "highlight-on";
        let fixture: ComponentFixture<ToastTestingComponent>;
        let element: HTMLElement;
        let notificationService: INotificationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [ToastTestingComponent, ToastDirective],
                providers: [ToastService, NotificationService],
            });
            fixture = TestBed.createComponent(ToastTestingComponent);
            fixture.autoDetectChanges(true);
            notificationService = TestBed.inject(NotificationService);
            element = fixture.nativeElement.firstChild;
        });
        it("should highlight element", () => {
            const options = {
                highlightState: SwitchState.on,
                items: [{ id: "testId" }],
                itemIdentificator: "id",
                status: "success",
            };
            notificationService.post("Highlight", options);

            expect(
                _find(
                    element.classList,
                    (className: string) => className === successStatus
                )
            ).not.toBeNull();
            expect(
                _find(
                    element.classList,
                    (className: string) => className === highlightOnClass
                )
            ).not.toBeNull();
        });
    });
});
