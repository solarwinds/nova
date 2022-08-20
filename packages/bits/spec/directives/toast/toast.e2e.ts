import _round from "lodash/round";
import { performance } from "perf_hooks";
import { browser } from "protractor";

import { Helpers } from "../../helpers";

import {
    IToastDeclaration,
    ToastPositionClass,
    ToastTestPage,
} from "./toast-test.po";
import { ToastAtom } from "./toast.atom";

describe("USERCONTROL Toast > ", () => {
    const page = new ToastTestPage();
    const defaultToastConfig: IToastDeclaration = {
        message: "Toast message",
        title: "Toast title",
        options: {
            timeOut: 0,
            extendedTimeOut: 0,
            clickToDismiss: true,
            positionClass: ToastPositionClass.TOP_RIGHT,
        },
    };
    let toastConfig: IToastDeclaration;

    beforeAll(async () => {
        await Helpers.prepareBrowser("toast/test");
    });

    beforeEach(() => {
        toastConfig = {
            ...defaultToastConfig,
            options: {
                ...defaultToastConfig.options,
            },
        };
    });

    afterEach(async () => {
        await page.reset();
    });

    it("should close when dismiss button is clicked", async () => {
        await page.showToasts(toastConfig);
        const toast = page.getToast();
        await toast.dismiss.click();
        expect(await toast.isPresent()).toEqual(false);
    });

    it("shouldn't disappear when user hovers over a toast", async () => {
        if (!toastConfig.options) {
            throw new Error("ToastConfig options property is not available");
        }
        toastConfig.options.timeOut = 500;
        await page.showToasts(toastConfig);
        const toast = page.getToast();
        await toast.hover();
        await browser.sleep(toastConfig.options.timeOut * 2);
        expect(
            (await toast.isPresent()) && (await toast.isDisplayed())
        ).toEqual(true);
    });

    it("should honor the timeout specified", async () => {
        if (!toastConfig.options) {
            throw new Error("ToastConfig options property is not available");
        }
        toastConfig.options.timeOut = 3000;
        await page.showToasts(toastConfig);
        const toast = page.getToast();

        const startPoint: number = performance.now();
        await toast.waitUntilNotDisplayed(toastConfig.options.timeOut * 1.5);
        const endPoint: number = performance.now();

        // rounding measured time to the nearest thousand, for this toast example it will be equal to 3000 milliseconds
        const timeBenchmark: number = _round(
            endPoint - startPoint - ToastAtom.animationTimeout,
            -3
        );
        expect(timeBenchmark).toEqual(toastConfig.options.timeOut);
    });

    it("should honor the extended timeout specified", async () => {
        if (!toastConfig.options) {
            throw new Error("ToastConfig options property is not available");
        }
        toastConfig.options.timeOut = 1000;
        toastConfig.options.extendedTimeOut = 3000;
        await page.showToasts(toastConfig);
        const toast = page.getToast();

        await toast.hover();
        await toast.unhover();

        const startPoint: number = performance.now();
        await toast.waitUntilNotDisplayed(
            toastConfig.options.extendedTimeOut * 1.5
        );
        const endPoint: number = performance.now();

        // rounding measured time to the nearest thousand, for this toast example it will be equal to 3000 milliseconds
        const timeBenchmark: number = _round(
            endPoint - startPoint - ToastAtom.animationTimeout,
            -3
        );
        expect(timeBenchmark).toEqual(toastConfig.options.extendedTimeOut);
    });

    it("should add a custom class", async () => {
        if (!toastConfig.options) {
            throw new Error("ToastConfig options property is not available");
        }
        toastConfig.options.positionClass = "demoToastCustomClass";
        await page.showToasts(toastConfig);
        const toast = page.getToast();

        expect(
            await toast.getToastsContainerPositioning(
                toastConfig.options.positionClass
            )
        ).toBe(true);
    });

    describe("html fragment", async () => {
        const message: string = `<a href="#">Link</a>`;
        it(" should be rendered", async () => {
            await page.showToasts({
                ...toastConfig,
                message,
                options: { enableHtml: true },
            });
            expect(await page.getToast().getBody()).not.toContain(
                `<a href="#">`
            );
        });

        it(" should not be rendered", async () => {
            await page.showToasts({
                ...toastConfig,
                message,
                options: { enableHtml: false },
            });

            const toast = page.getToast();
            expect(
                (await toast.isPresent()) && (await toast.isDisplayed())
            ).toEqual(true);
            expect(await toast.getBody()).toContain(`<a href="#">`);
        });

        it(" should not contain forbidden tags", async () => {
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
            const toastBody = await page.getToast().getBody();
            expect(toastBody).not.toContain(`<script>`);
            expect(toastBody).not.toContain(`<object>`);
            expect(toastBody).not.toContain(`<iframe>`);
            expect(toastBody).not.toContain(`<embed>`);
        });
    });

    describe("options.clickToDismiss", () => {
        it("should close toast by click when set to 'true'", async () => {
            await page.showToasts(toastConfig);
            const toast = page.getToast();

            await toast.click();
            expect(await toast.isPresent()).toEqual(false);
        });

        it("shouldn't close toast by click when set to 'false'", async () => {
            if (!toastConfig.options) {
                throw new Error(
                    "ToastConfig options property is not available"
                );
            }
            toastConfig.options.clickToDismiss = false;
            await page.showToasts(toastConfig);
            const toast = page.getToast();

            await toast.click();
            expect(
                (await toast.isPresent()) && (await toast.isDisplayed())
            ).toEqual(true);
        });
    });

    // TODO: Test other options
});
