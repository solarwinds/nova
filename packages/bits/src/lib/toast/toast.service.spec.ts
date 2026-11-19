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

import { NgZone } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { IToastService } from "./public-api";
import { ToastContainerService } from "./toast-container.service";
import { ToastComponent } from "./toast.component";
import { ToastService } from "./toast.service";
import { ToastServiceBase } from "./toast.servicebase";
import { NotificationService } from "../../services/notification-service";
import { IconComponent } from "../icon/icon.component";

describe("services >", () => {
    describe("toast >", () => {
        let toastService: IToastService | any;
        // Production removals reach the service from NgZone-tracked toast timers or UI events.
        const removeInAngularZone = (toastId: number): boolean =>
            TestBed.inject(NgZone).run(() => toastService.remove(toastId));

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [ToastComponent],
                imports: [IconComponent],
                providers: [
                    NotificationService,
                    ToastContainerService,
                    ToastService,
                    { provide: ToastServiceBase, useExisting: ToastService },
                ],
            });

            toastService = TestBed.inject(ToastService);
            toastService.clear();
        });

        it("setConfig should override global toast config", () => {
            expect(toastService.toastConfig.timeOut).toEqual(5000);
            toastService.setConfig({
                timeOut: 10000,
            });
            expect(toastService.toastConfig.timeOut).toEqual(10000);
        });

        it("should activate success toast", fakeAsync(() => {
            const activeToast = toastService.success({
                message: "Test success message",
            });
            expect(toastService.toasts.length).toEqual(1);
            expect(activeToast.body).toEqual("Test success message");
            toastService.remove(activeToast.toastId);
            tick(10000);
        }));

        it("should activate warning toast", fakeAsync(() => {
            const activeToast = toastService.warning({
                message: "Test warning message",
            });
            expect(toastService.toasts.length).toEqual(1);
            expect(activeToast.body).toEqual("Test warning message");
            toastService.remove(activeToast.toastId);
            tick(10000);
        }));

        it("should activate error toast", fakeAsync(() => {
            const activeToast = toastService.error({
                message: "Test error message",
            });
            expect(toastService.toasts.length).toEqual(1);
            expect(activeToast.body).toEqual("Test error message");
            toastService.remove(activeToast.toastId);
            tick(10000);
        }));

        it("should activate info toast", fakeAsync(() => {
            const activeToast = toastService.info({
                message: "Test info message",
            });
            expect(toastService.toasts.length).toEqual(1);
            expect(activeToast.body).toEqual("Test info message");
            toastService.remove(activeToast.toastId);
            tick(10000);
        }));

        it("should sanitize body content", fakeAsync(() => {
            const activeToast = toastService.info({
                message: `Test info message, <script>alert("ALERT")</script>`,
                options: { enableHtml: true },
            });
            expect(toastService.toasts.length).toEqual(1);
            expect(activeToast.body).not.toContain("<script>");
            toastService.remove(activeToast.toastId);
            tick(10000);
        }));

        it("should not sanitize body content", fakeAsync(() => {
            const activeToast = toastService.info({
                message: `Test info message, <script>alert("ALERT")</script>`,
                options: { enableHtml: false },
            });
            expect(toastService.toasts.length).toEqual(1);
            expect(activeToast.body).toContain("<script>");
            toastService.remove(activeToast.toastId);
            tick(10000);
        }));

        it("should make error message unclosable", fakeAsync(() => {
            const activeToast = toastService.error({
                message: "Test message",
                options: { stickyError: true },
            });
            expect(
                activeToast.toastRef.componentInstance.instance.options.timeOut
            ).toEqual(0);
            expect(
                activeToast.toastRef.componentInstance.instance.options
                    .extendedTimeOut
            ).toEqual(0);
            expect(
                activeToast.toastRef.componentInstance.instance.options
                    .closeButton
            ).toEqual(false);
            toastService.remove(activeToast.toastId);
            tick(10000);
        }));

        it("should remove toasts on 'clear'", fakeAsync(() => {
            toastService.success({ message: "Success" });
            toastService.error({ message: "Error" });
            tick();
            expect(toastService.toasts.length).toEqual(2);
            toastService.clear();
            tick(299);
            expect(toastService.toasts.length).toEqual(2);
            tick(1);
            expect(toastService.toasts.length).toEqual(0);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should reserve activation slots for synchronously created toasts", fakeAsync(() => {
            toastService.setConfig({
                maxOpened: 1,
            });
            const first = toastService.success({ message: "First" });
            const second = toastService.info({ message: "Second" });
            const third = toastService.warning({ message: "Third" });
            const firstShown = jasmine.createSpy("firstShown");
            const secondShown = jasmine.createSpy("secondShown");
            const thirdShown = jasmine.createSpy("thirdShown");
            first.onShown?.subscribe(firstShown);
            second.onShown?.subscribe(secondShown);
            third.onShown?.subscribe(thirdShown);

            expect(toastService.currentlyActive).toEqual(1);
            tick();
            expect(firstShown).toHaveBeenCalledTimes(1);
            expect(secondShown).not.toHaveBeenCalled();
            expect(thirdShown).not.toHaveBeenCalled();
            expect(toastService.currentlyActive).toEqual(1);

            removeInAngularZone(first.toastId);
            tick();
            expect(secondShown).toHaveBeenCalledTimes(1);
            expect(thirdShown).not.toHaveBeenCalled();
            expect(toastService.currentlyActive).toEqual(1);

            removeInAngularZone(second.toastId);
            tick();
            expect(thirdShown).toHaveBeenCalledTimes(1);
            expect(toastService.currentlyActive).toEqual(1);

            toastService.clear();
            tick(300);
            expect(toastService.toasts.length).toEqual(0);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should not activate queued toasts when all toasts are cleared", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 1 });
            const first = toastService.success({ message: "First" });
            const queued = toastService.info({ message: "Queued" });
            const firstHidden = jasmine.createSpy("firstHidden");
            const queuedShown = jasmine.createSpy("queuedShown");
            first.onHidden?.subscribe(firstHidden);
            queued.onShown?.subscribe(queuedShown);

            tick();
            toastService.clear();
            tick(300);

            expect(firstHidden).toHaveBeenCalledTimes(1);
            expect(queuedShown).not.toHaveBeenCalled();
            expect(toastService.toasts.length).toEqual(0);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should not release an active slot when removing a queued toast", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 1 });
            const first = toastService.success({ message: "First" });
            const queued = toastService.info({ message: "Queued" });
            const next = toastService.warning({ message: "Next" });
            const nextShown = jasmine.createSpy("nextShown");
            next.onShown?.subscribe(nextShown);

            tick();
            toastService.remove(queued.toastId);
            expect(toastService.currentlyActive).toEqual(1);
            expect(nextShown).not.toHaveBeenCalled();

            removeInAngularZone(first.toastId);
            tick();
            expect(nextShown).toHaveBeenCalledTimes(1);
            expect(toastService.currentlyActive).toEqual(1);

            toastService.clear();
            tick(300);
            expect(toastService.toasts.length).toEqual(0);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should not activate a toast removed before its scheduled activation", fakeAsync(() => {
            const toast = toastService.success({ message: "First" });
            const shown = jasmine.createSpy("shown");
            toast.onShown?.subscribe(shown);

            toastService.remove(toast.toastId);
            tick();

            expect(shown).not.toHaveBeenCalled();
            expect(toastService.toasts.length).toEqual(0);
            expect(toastService.currentlyActive).toEqual(0);
        }));
    });
});
