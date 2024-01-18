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

import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

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

        beforeEach(() => {
            TestBed.overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: [ToastComponent],
                },
            });

            TestBed.configureTestingModule({
                declarations: [ToastComponent, IconComponent],
                providers: [
                    NotificationService,
                    ToastContainerService,
                    ToastService,
                    ToastServiceBase,
                ],
            });

            toastService = TestBed.inject(ToastService);
            toastService.clear();
        });

        afterEach(() => {
            // This hack catches the "_this.toastService.remove is not a function thrown" exception and fixes it's random appearance in tests.
            // The exception is thrown becasue toast component is not able to remove itself for some reason, which should be investigated.
            // TODO: NUI-3621 - Investigate why toast message is not closed automatically after default timeout passes, and throws exception instead
            fakeAsync(() => {
                try {
                    tick(10000);
                } catch (e) {}
            });
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

        // TODO: enable after NUI-3639 is fixed
        xit("should remove toasts on 'clear'", fakeAsync(() => {
            toastService.success("Success");
            toastService.error("Error");
            expect(toastService.toasts.length).toEqual(2);
            toastService.clear();
            expect(toastService.toasts.length).toEqual(0);
        }));

        // TODO: enable after NUI-3640 is fixed
        xit("should activate next inactive toast on 'remove'", fakeAsync(() => {
            toastService.setConfig({
                maxOpened: 1,
            });
            const activeToast = toastService.success("Success");
            const deferredToast = toastService.info("Info");
            spyOn(deferredToast.toastRef, "activate").and.callThrough();
            expect(toastService.currentlyActive).toEqual(0);
            toastService.remove(activeToast.id);
            expect(toastService.currentlyActive).toEqual(1);
            expect(deferredToast.toastRef.activate).toHaveBeenCalled();
        }));
    });
});
