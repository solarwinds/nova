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

import { MessageAtom } from "./message.atom";
import { Atom } from "../../atom";
import { test, expect, Helpers } from "../../setup";
import { ButtonAtom } from "../button/button.atom";

test.describe("USERCONTROL Message", () => {
    let messageDismissAllowed: MessageAtom;
    let messageDismissNotAllowed: MessageAtom;
    let messageManualControl: MessageAtom;
    let manualControlToggle: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("message/message-test", page);

        messageDismissAllowed = Atom.find<MessageAtom>(
            MessageAtom,
            "nui-demo-message-dismiss-allowed"
        );
        messageDismissNotAllowed = Atom.find<MessageAtom>(
            MessageAtom,
            "nui-demo-message-dismiss-not-allowed"
        );
        messageManualControl = Atom.find<MessageAtom>(
            MessageAtom,
            "nui-demo-message-manual-control"
        );
        manualControlToggle = new ButtonAtom(
            page.getByRole("button", {
                name: "Toggle state of message",
            })
        );
    });

    test("should always have .nui-message class", async () => {
        await messageDismissAllowed.toContainClass("nui-message");
        await messageDismissNotAllowed.toContainClass("nui-message");
    });

    test("should have type class based on 'type' attribute", async () => {
        await messageDismissAllowed.toContainClass("nui-message-ok");
    });

    test("should have class 'nui-message-allow-dismiss' based on 'allowDismiss' property", async () => {
        await messageDismissAllowed.toContainClass("nui-message-allow-dismiss");
        await messageDismissNotAllowed.toNotContainClass(
            "nui-message-allow-dismiss"
        );
    });

    test("should have icon based on 'type' attribute", async () => {
        await expect(
            messageDismissAllowed.statusIcon.getLocator()
        ).toHaveAttribute("icon", "severity_ok");
        await expect(
            messageDismissNotAllowed.statusIcon.getLocator()
        ).toHaveAttribute("icon", "severity_warning");
    });

    test("should align a larger dismiss button with the status icon even when text wraps", async () => {
        const message = messageDismissAllowed.getLocator();
        await messageDismissAllowed.toBeVisible();
        const contentHeights: number[] = [];

        for (const [width, buttonHeight] of [
            [640, 30],
            [250, 40],
        ]) {
            const layout = await message.evaluate(
                (element, { width, buttonHeight }) => {
                    element.style.width = `${width}px`;
                    const statusIcon =
                        element.querySelector(".nui-message-icon");
                    const dismissButton =
                        element.querySelector<HTMLButtonElement>(
                            ".nui-message-dismiss-button button"
                        );
                    const content = element.querySelector(
                        ".nui-message-content"
                    );
                    if (!statusIcon || !dismissButton || !content) {
                        throw new Error("Message layout elements are missing");
                    }

                    dismissButton.style.height = `${buttonHeight}px`;
                    const centerY = (element: Element) => {
                        const { top, height } = element.getBoundingClientRect();
                        return top + height / 2;
                    };
                    return {
                        offset: Math.abs(
                            centerY(statusIcon) - centerY(dismissButton)
                        ),
                        contentHeight: content.getBoundingClientRect().height,
                    };
                },
                { width, buttonHeight }
            );

            expect(layout.offset).toBeLessThan(1);
            contentHeights.push(layout.contentHeight);
        }

        expect(contentHeights[1]).toBeGreaterThan(contentHeights[0]);
    });

    test("should be dismissed after 'click'", async () => {
        await messageDismissAllowed.toBeVisible();
        await messageDismissAllowed.dismiss();
        await messageDismissAllowed.toBeHidden();
    });

    test("message should disappear after click on 'Toggle state of message' button", async () => {
        await messageManualControl.toBeVisible();
        await manualControlToggle.click();
        await messageManualControl.toBeHidden();
    });
});
