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

import { performance } from "perf_hooks";

import _round from "lodash/round";

import { expect, Helpers, test } from "../../setup";
import {
    IToastDeclaration,
    ToastPositionClass,
    ToastTestPage,
} from "./toast-test.po";
import { ToastAtom } from "./toast.atom";

test.describe("USERCONTROL Toast", () => {
    let page: ToastTestPage;

    const defaultToastConfig: IToastDeclaration = Object.freeze({
        message: "Toast message",
        title: "Toast title",
        options: {
            timeOut: 0,
            extendedTimeOut: 0,
            clickToDismiss: true,
            positionClass: ToastPositionClass.TOP_RIGHT,
        },
    });

    let toastConfig: IToastDeclaration;

    test.beforeEach(async ({ page: pwPage }) => {
        await Helpers.prepareBrowser("toast/test", pwPage);
        page = new ToastTestPage();

        toastConfig = {
            ...defaultToastConfig,
            options: {
                ...defaultToastConfig.options,
            },
        };
    });

    test.afterEach(async () => {
        await page.reset();
    });

    test("should close when dismiss button is clicked", async () => {
        await page.showToasts(toastConfig);
        const toast = await page.asertWaitForToastDisplayed();
        await toast.dismiss.click();
        await toast.toBeHidden();
    });

    test("shouldn't disappear when user hovers over a toast", async () => {
        if (!toastConfig.options) {
            throw new Error("ToastConfig options property is not available");
        }
        toastConfig.options.timeOut = 500;
        await page.showToasts(toastConfig);
        const toast = await page.asertWaitForToastDisplayed();
        await toast.hover();
        await Helpers.page.waitForTimeout(toastConfig.options.timeOut * 2);
        expect((await toast.isPresent()) && (await toast.isDisplayed())).toEqual(
            true
        );
    });

    test("should honor the timeout specified", async () => {
        if (!toastConfig.options) {
            throw new Error("ToastConfig options property is not available");
        }
        toastConfig.options.timeOut = 3000;
        await page.showToasts(toastConfig);
        const toast = await page.asertWaitForToastDisplayed();

        const startPoint: number = performance.now();
        await toast.waitUntilNotDisplayed(toastConfig.options.timeOut * 1.5);
        const endPoint: number = performance.now();

        const timeBenchmark: number = _round(
            endPoint - startPoint - ToastAtom.animationTimeout,
            -3
        );
        expect(timeBenchmark - 1000).toEqual(toastConfig.options.timeOut);
    });

    test("should honor the extended timeout specified", async () => {
        if (!toastConfig.options) {
            throw new Error("ToastConfig options property is not available");
        }
        toastConfig.options.timeOut = 1000;
        toastConfig.options.extendedTimeOut = 3000;
        await page.showToasts(toastConfig);
        const toast = await page.asertWaitForToastDisplayed();

        await toast.hover();
        await toast.unhover();

        const startPoint: number = performance.now();
        await toast.waitUntilNotDisplayed(
            toastConfig.options.extendedTimeOut * 1.5
        );
        const endPoint: number = performance.now();

        const timeBenchmark: number = _round(
            endPoint - startPoint - ToastAtom.animationTimeout,
            -3
        );
        expect(timeBenchmark - 1000).toEqual(toastConfig.options.extendedTimeOut);
    });

    test("should add a custom class", async () => {
        if (!toastConfig.options) {
            throw new Error("ToastConfig options property is not available");
        }
        toastConfig.options.positionClass = "demoToastCustomClass";
        await page.showToasts(toastConfig);
        const toast = await page.asertWaitForToastDisplayed();

        expect(
            await toast.getToastsContainerPositioning(
                toastConfig.options.positionClass
            )
        ).toBe(true);
    });

    test.describe("html fragment", () => {
        const messageText = "Link";
        const messageWithHtml = `<a href="#">${messageText}</a>`;

        test("should be rendered", async () => {
            await page.showToasts({
                ...toastConfig,
                message: messageWithHtml,
                options: { enableHtml: true },
            });

            const toast = await page.asertWaitForToastDisplayed();
            const bodyText = await toast.getBody();
            const bodyHtml = await toast.getBodyHtml();
            expect(bodyHtml).toContain(messageWithHtml);
            expect(bodyText).not.toContain(messageWithHtml);
            expect(bodyText).toContain(messageText);
        });

        test("should not be rendered", async () => {
            await page.showToasts({
                ...toastConfig,
                message: messageWithHtml,
                options: { enableHtml: false },
            });

            const toast = await page.asertWaitForToastDisplayed();
            const bodyText = await toast.getBody();
            const bodyHtml = await toast.getBodyHtml();
            expect(bodyHtml).not.toContain(messageWithHtml);
            expect(bodyText).toContain(messageWithHtml);
        });

        test("should not contain forbidden tags", async () => {
            const messageWithForbiddenTags = `Hi there! I'm a simple toast message
                <script>alert("You shall not pass")</script>
                <object width="400" height="400"></object>
                <iframe src="https://www.solarwinds.com/"></iframe>
                <embed src="https://www.solarwinds.com/">`;
            await page.showToasts({
                ...toastConfig,
                message: messageWithForbiddenTags,
                options: { enableHtml: true },
            });
            const toast = await page.asertWaitForToastDisplayed();
            const toastBody = await toast.getBody();
            const toastBodyHtml = await toast.getBodyHtml();
            expect(toastBody).not.toContain(`<script>`);
            expect(toastBody).not.toContain(`<object>`);
            expect(toastBody).not.toContain(`<iframe>`);
            expect(toastBody).not.toContain(`<embed>`);
            expect(toastBodyHtml).not.toContain(`<script>`);
            expect(toastBodyHtml).not.toContain(`<object>`);
            expect(toastBodyHtml).not.toContain(`<iframe>`);
            expect(toastBodyHtml).not.toContain(`<embed>`);
        });
    });

    test.describe("options.clickToDismiss", () => {
        test("should close toast by click when set to 'true'", async () => {
            await page.showToasts(toastConfig);
            const toast = await page.asertWaitForToastDisplayed();

            await toast.click();
            await toast.toBeHidden();
        });

        test("shouldn't close toast by click when set to 'false'", async () => {
            if (!toastConfig.options) {
                throw new Error(
                    "ToastConfig options property is not available"
                );
            }
            toastConfig.options.clickToDismiss = false;
            await page.showToasts(toastConfig);
            const toast = await page.asertWaitForToastDisplayed();

            await toast.click();
            expect((await toast.isPresent()) && (await toast.isDisplayed())).toEqual(
                true
            );
        });
    });

    // TODO: Test other options
});
