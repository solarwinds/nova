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

import { browser, by, element, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom, MessageAtom } from "../public_api";

describe("USERCONTROL Message", () => {
    let messageDismissAllowed: MessageAtom;
    let messageDismissNotAllowed: MessageAtom;
    let messageManualControl: MessageAtom;
    let manualControlToggle: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("message/message-test");

        messageDismissAllowed = Atom.find(
            MessageAtom,
            "nui-demo-message-dismiss-allowed"
        );
        messageDismissNotAllowed = Atom.find(
            MessageAtom,
            "nui-demo-message-dismiss-not-allowed"
        );
        messageManualControl = Atom.find(
            MessageAtom,
            "nui-demo-message-manual-control"
        );
        manualControlToggle = Atom.findIn(
            ButtonAtom,
            element(by.buttonText("Toggle state of message"))
        );
    });

    it("should always have .nui-message class", async () => {
        expect(await messageDismissAllowed.hasClass("nui-message")).toBe(true);
        expect(await messageDismissNotAllowed.hasClass("nui-message")).toBe(
            true
        );
    });

    it("should have type class based on 'type' attribute", async () => {
        expect(await messageDismissAllowed.hasClass("nui-message-ok")).toBe(
            true
        );
    });

    it("should have class 'nui-message-allow-dismiss' based on 'allowDismiss' property", async () => {
        expect(
            await messageDismissAllowed.hasClass("nui-message-allow-dismiss")
        ).toBe(true);
        expect(
            await messageDismissNotAllowed.hasClass("nui-message-allow-dismiss")
        ).toBe(false);
    });

    it("should have icon based on 'type' attribute", async () => {
        expect(await messageDismissAllowed.getStatusIcon().getName()).toEqual(
            "severity_ok"
        );
        expect(
            await messageDismissNotAllowed.getStatusIcon().getName()
        ).toEqual("severity_warning");
    });

    it("should be dismissed after 'click'", async () => {
        expect(await messageDismissAllowed.isVisible()).toBe(true);
        await messageDismissAllowed.dismissMessage();
        expect(await messageDismissAllowed.isPresent()).toBe(false);
    });

    it("message should disappear after click on 'Toggle state of message' button", async () => {
        expect(await messageManualControl.isVisible()).toBe(true);
        await manualControlToggle.click();
        await browser.wait(
            ExpectedConditions.invisibilityOf(messageManualControl.getElement())
        );
        expect(await messageManualControl.isVisible()).toBe(false);
    });
});
