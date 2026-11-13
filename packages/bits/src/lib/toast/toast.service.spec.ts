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

import { ComponentRef } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { IActiveToast, IToastService } from "./public-api";
import { ToastContainerService } from "./toast-container.service";
import { ToastComponent } from "./toast.component";
import { ToastService } from "./toast.service";
import { ToastServiceBase } from "./toast.servicebase";
import { NotificationService } from "../../services/notification-service";
import { IconComponent } from "../icon/icon.component";

describe("services >", () => {
    describe("toast >", () => {
        let toastService: IToastService | any;

        const getToastElement = (toast: IActiveToast): HTMLElement => {
            const componentRef: ComponentRef<ToastComponent> =
                toast.toastRef.componentInstance;
            return componentRef.location.nativeElement;
        };

        const expectToastVisible = (
            toast: IActiveToast,
            visible: boolean
        ): void => {
            const element = getToastElement(toast);
            expect(element.isConnected).toBe(true);
            expect(getComputedStyle(element).display).toEqual(
                visible ? "block" : "none"
            );
            if (visible) {
                expect(element.classList).not.toContain("nui-toast--fade-out");
            }
        };

        const observeToast = (toast: IActiveToast) => {
            const shown = jasmine.createSpy("toast shown");
            const hidden = jasmine.createSpy("toast hidden");
            toast.toastRef.afterActivate().subscribe(shown);
            toast.toastRef.afterClosed().subscribe(hidden);
            return { shown, hidden };
        };

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

        it("should clear active and queued toasts without showing the queued toasts", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 1 });
            const first = toastService.success({ message: "First" });
            const firstEvents = observeToast(first);
            tick();
            const second = toastService.info({ message: "Second" });
            const secondEvents = observeToast(second);
            const third = toastService.warning({ message: "Third" });
            const thirdEvents = observeToast(third);

            toastService.clear();
            tick(299);
            expect(firstEvents.hidden).not.toHaveBeenCalled();
            expect(secondEvents.hidden).not.toHaveBeenCalled();
            expect(thirdEvents.hidden).not.toHaveBeenCalled();
            expectToastVisible(second, false);
            expectToastVisible(third, false);
            tick(1);
            expect(firstEvents.hidden).toHaveBeenCalledTimes(1);
            expect(secondEvents.hidden).toHaveBeenCalledTimes(1);
            expect(thirdEvents.hidden).toHaveBeenCalledTimes(1);
            expect(secondEvents.shown).not.toHaveBeenCalled();
            expect(thirdEvents.shown).not.toHaveBeenCalled();
            expect(getToastElement(first).isConnected).toBe(false);
            expect(getToastElement(second).isConnected).toBe(false);
            expect(getToastElement(third).isConnected).toBe(false);
            expect(toastService.toasts.length).toEqual(0);
            expect(toastService.currentlyActive).toEqual(0);

            const next = toastService.success({ message: "Next" });
            const nextEvents = observeToast(next);
            tick();
            expect(nextEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(next, true);
            toastService.clear();
            tick(300);
            expect(nextEvents.hidden).toHaveBeenCalledTimes(1);
        }));

        it("should skip a closing queued toast when activating the next toast", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 1 });
            const first = toastService.success({ message: "First" });
            tick();
            const second = toastService.info({ message: "Second" });
            const secondEvents = observeToast(second);
            const third = toastService.warning({ message: "Third" });
            const thirdEvents = observeToast(third);

            toastService.clear(first.toastId);
            toastService.clear(second.toastId);
            tick(300);
            expect(secondEvents.shown).not.toHaveBeenCalled();
            expect(secondEvents.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(second).isConnected).toBe(false);
            expect(thirdEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(third, true);
            expect(toastService.currentlyActive).toEqual(1);
            toastService.clear();
            tick(300);
            expect(thirdEvents.hidden).toHaveBeenCalledTimes(1);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should not show toasts cleared before their scheduled activation", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 1 });
            const first = toastService.success({ message: "First" });
            const firstEvents = observeToast(first);
            const second = toastService.info({ message: "Second" });
            const secondEvents = observeToast(second);

            toastService.clear();
            tick();
            expect(firstEvents.shown).not.toHaveBeenCalled();
            expect(secondEvents.shown).not.toHaveBeenCalled();
            expectToastVisible(first, false);
            expectToastVisible(second, false);
            tick(300);
            expect(firstEvents.hidden).toHaveBeenCalledTimes(1);
            expect(secondEvents.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(first).isConnected).toBe(false);
            expect(getToastElement(second).isConnected).toBe(false);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should cancel the pending fade-in when cleared from the shown event", fakeAsync(() => {
            const toast = toastService.success({ message: "First" });
            const events = observeToast(toast);
            toast.toastRef
                .afterActivate()
                .subscribe(() => toastService.clear());

            tick();
            expect(events.shown).toHaveBeenCalledTimes(1);
            expect(getToastElement(toast).classList).toContain(
                "nui-toast--fade-out"
            );
            tick(299);
            expect(events.hidden).not.toHaveBeenCalled();
            tick(1);
            expect(events.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(toast).isConnected).toBe(false);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should activate next inactive toast on 'remove'", fakeAsync(() => {
            toastService.setConfig({
                maxOpened: 1,
            });
            const activeToast = toastService.success({ message: "Success" });
            tick();
            const deferredToast = toastService.info({ message: "Info" });
            spyOn(deferredToast.toastRef, "activate").and.callThrough();
            expect(toastService.currentlyActive).toEqual(1);
            expect(
                deferredToast.toastRef.componentInstance.instance.display
            ).toEqual("none");
            toastService.remove(activeToast.toastId);
            expect(toastService.currentlyActive).toEqual(1);
            expect(deferredToast.toastRef.activate).toHaveBeenCalledTimes(1);
            tick();
            expect(
                deferredToast.toastRef.componentInstance.instance.display
            ).toEqual("block");
            toastService.clear();
            tick(300);
            expect(toastService.toasts.length).toEqual(0);
        }));

        it("should queue synchronously created toasts when maxOpened is reached", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 1 });
            const first = toastService.success({ message: "First" });
            const second = toastService.info({ message: "Second" });
            const third = toastService.warning({ message: "Third" });
            const firstEvents = observeToast(first);
            const secondEvents = observeToast(second);
            const thirdEvents = observeToast(third);

            tick();
            expect(toastService.currentlyActive).toEqual(1);
            expect(firstEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(first, true);
            expectToastVisible(second, false);
            expectToastVisible(third, false);
            expect(secondEvents.shown).not.toHaveBeenCalled();
            expect(thirdEvents.shown).not.toHaveBeenCalled();

            toastService.remove(first.toastId);
            tick();
            expect(toastService.currentlyActive).toEqual(1);
            expect(firstEvents.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(first).isConnected).toBe(false);
            expect(secondEvents.shown).toHaveBeenCalledTimes(1);
            expect(thirdEvents.shown).not.toHaveBeenCalled();
            expectToastVisible(second, true);
            expectToastVisible(third, false);

            toastService.remove(second.toastId);
            tick();
            expect(toastService.currentlyActive).toEqual(1);
            expect(secondEvents.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(second).isConnected).toBe(false);
            expect(thirdEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(third, true);
            toastService.clear();
            tick(300);
            expect(thirdEvents.hidden).toHaveBeenCalledTimes(1);
            expect(toastService.toasts.length).toEqual(0);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should reserve multiple available slots before activation", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 2 });
            const first = toastService.success({ message: "First" });
            const second = toastService.info({ message: "Second" });
            const third = toastService.warning({ message: "Third" });
            const thirdEvents = observeToast(third);

            expect(toastService.currentlyActive).toEqual(2);
            tick();
            expect(toastService.currentlyActive).toEqual(2);
            expectToastVisible(first, true);
            expectToastVisible(second, true);
            expectToastVisible(third, false);
            expect(thirdEvents.shown).not.toHaveBeenCalled();
            toastService.remove(second.toastId);
            tick();
            expect(toastService.currentlyActive).toEqual(2);
            expect(getToastElement(second).isConnected).toBe(false);
            expect(thirdEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(first, true);
            expectToastVisible(third, true);
            toastService.clear();
            tick(300);
            expect(thirdEvents.hidden).toHaveBeenCalledTimes(1);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should allow synchronously created toasts when maxOpened is unlimited", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 0 });
            const first = toastService.success({ message: "First" });
            const second = toastService.info({ message: "Second" });
            const firstEvents = observeToast(first);
            const secondEvents = observeToast(second);
            tick();
            expect(toastService.currentlyActive).toEqual(2);
            expect(firstEvents.shown).toHaveBeenCalledTimes(1);
            expect(secondEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(first, true);
            expectToastVisible(second, true);
            toastService.clear();
            tick(300);
            expect(firstEvents.hidden).toHaveBeenCalledTimes(1);
            expect(secondEvents.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(first).isConnected).toBe(false);
            expect(getToastElement(second).isConnected).toBe(false);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should not activate a toast removed before its scheduled activation", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 1 });
            const first = toastService.success({ message: "First" });
            const second = toastService.info({ message: "Second" });
            const firstEvents = observeToast(first);
            const secondEvents = observeToast(second);

            toastService.remove(first.toastId);
            tick();
            expect(firstEvents.shown).not.toHaveBeenCalled();
            expect(firstEvents.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(first).isConnected).toBe(false);
            expect(secondEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(second, true);
            expect(toastService.currentlyActive).toEqual(1);
            toastService.clear();
            tick(300);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should not release an active slot when removing a queued toast", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 1 });
            const first = toastService.success({ message: "First" });
            tick();
            const second = toastService.info({ message: "Second" });
            const third = toastService.warning({ message: "Third" });
            const secondEvents = observeToast(second);
            const thirdEvents = observeToast(third);

            toastService.remove(second.toastId);
            tick();
            expect(toastService.currentlyActive).toEqual(1);
            expect(secondEvents.shown).not.toHaveBeenCalled();
            expect(secondEvents.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(second).isConnected).toBe(false);
            expect(thirdEvents.shown).not.toHaveBeenCalled();
            expectToastVisible(first, true);
            expectToastVisible(third, false);
            toastService.remove(first.toastId);
            tick();
            expect(toastService.currentlyActive).toEqual(1);
            expect(thirdEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(third, true);
            toastService.clear();
            tick(300);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should track active slots after maxOpened is increased", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 1 });
            const first = toastService.success({ message: "First" });
            const firstEvents = observeToast(first);
            tick();
            const queued = toastService.info({ message: "Queued" });
            const queuedEvents = observeToast(queued);
            toastService.setConfig({ maxOpened: 2 });
            const third = toastService.warning({ message: "Third" });
            const thirdEvents = observeToast(third);
            tick();
            expect(firstEvents.shown).toHaveBeenCalledTimes(1);
            expect(thirdEvents.shown).toHaveBeenCalledTimes(1);
            expect(queuedEvents.shown).not.toHaveBeenCalled();
            expectToastVisible(first, true);
            expectToastVisible(third, true);
            expectToastVisible(queued, false);

            toastService.remove(queued.toastId);
            tick();
            expect(toastService.currentlyActive).toEqual(2);
            expect(queuedEvents.hidden).toHaveBeenCalledTimes(1);
            expect(queuedEvents.shown).not.toHaveBeenCalled();
            expect(getToastElement(queued).isConnected).toBe(false);
            expectToastVisible(first, true);
            expectToastVisible(third, true);
            toastService.clear();
            tick(300);
            expect(firstEvents.hidden).toHaveBeenCalledTimes(1);
            expect(thirdEvents.hidden).toHaveBeenCalledTimes(1);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should not activate a queued toast until below a reduced maxOpened limit", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 2 });
            const first = toastService.success({ message: "First" });
            const second = toastService.info({ message: "Second" });
            const third = toastService.warning({ message: "Third" });
            const thirdEvents = observeToast(third);
            tick();
            expectToastVisible(first, true);
            expectToastVisible(second, true);
            expectToastVisible(third, false);

            toastService.setConfig({ maxOpened: 1 });
            toastService.remove(first.toastId);
            tick();
            expect(toastService.currentlyActive).toEqual(1);
            expect(getToastElement(first).isConnected).toBe(false);
            expect(thirdEvents.shown).not.toHaveBeenCalled();
            expectToastVisible(second, true);
            expectToastVisible(third, false);
            toastService.remove(second.toastId);
            tick();
            expect(toastService.currentlyActive).toEqual(1);
            expect(getToastElement(second).isConnected).toBe(false);
            expect(thirdEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(third, true);
            toastService.clear();
            tick(300);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should activate a queued toast after autoDismiss closes the active toast", fakeAsync(() => {
            toastService.setConfig({ maxOpened: 1, autoDismiss: true });
            const first = toastService.success({ message: "First" });
            const firstEvents = observeToast(first);
            tick();
            const second = toastService.info({ message: "Second" });
            const secondEvents = observeToast(second);

            tick(299);
            expect(firstEvents.hidden).not.toHaveBeenCalled();
            expect(secondEvents.shown).not.toHaveBeenCalled();
            expectToastVisible(second, false);
            tick(1);
            expect(firstEvents.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(first).isConnected).toBe(false);
            expect(secondEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(second, true);
            expect(toastService.currentlyActive).toEqual(1);
            expect(toastService.toasts.length).toEqual(1);
            toastService.clear();
            tick(300);
            expect(secondEvents.hidden).toHaveBeenCalledTimes(1);
            expect(toastService.currentlyActive).toEqual(0);
        }));

        it("should activate a queued toast after the active toast expires", fakeAsync(() => {
            toastService.setConfig({
                maxOpened: 1,
                timeOut: 100,
                progressBar: false,
            });
            const first = toastService.success({ message: "First" });
            const firstEvents = observeToast(first);
            tick();
            const second = toastService.info({ message: "Second" });
            const secondEvents = observeToast(second);

            tick(399);
            expect(firstEvents.hidden).not.toHaveBeenCalled();
            expect(secondEvents.shown).not.toHaveBeenCalled();
            expectToastVisible(second, false);
            tick(1);
            expect(firstEvents.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(first).isConnected).toBe(false);
            expect(secondEvents.shown).toHaveBeenCalledTimes(1);
            expectToastVisible(second, true);
            expect(toastService.currentlyActive).toEqual(1);
            expect(toastService.toasts.length).toEqual(1);
            tick(400);
            expect(secondEvents.hidden).toHaveBeenCalledTimes(1);
            expect(getToastElement(second).isConnected).toBe(false);
            expect(toastService.toasts.length).toEqual(0);
            expect(toastService.currentlyActive).toEqual(0);
        }));
    });
});
