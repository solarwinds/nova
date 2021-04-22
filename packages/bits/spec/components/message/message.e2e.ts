import { browser, by, element, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom, MessageAtom } from "../public_api";

fdescribe("USERCONTROL Message", () => {
    let messageDismissAllowed: MessageAtom;
    let messageDismissNotAllowed: MessageAtom;
    let messageManualControl: MessageAtom;
    let manualControlToggle: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("message/message-test");

        messageDismissAllowed = Atom.find(MessageAtom, "nui-demo-message-dismiss-allowed");
        messageDismissNotAllowed = Atom.find(MessageAtom, "nui-demo-message-dismiss-not-allowed");
        messageManualControl = Atom.find(MessageAtom, "nui-demo-message-manual-control");
        manualControlToggle = Atom.findIn(ButtonAtom, element(by.buttonText("Toggle state of message")));
    });

    it("should always have .nui-message class", async () => {
        expect(await messageDismissAllowed.hasClass("nui-message")).toBe(true);
        expect(await messageDismissNotAllowed.hasClass("nui-message")).toBe(true);
    });

    it("should have type class based on 'type' attribute", async () => {
        expect(await messageDismissAllowed.hasClass("nui-message-ok")).toBe(true);
    });

    it("should have class 'nui-message-allow-dismiss' based on 'allowDismiss' property", async () => {
        expect(await messageDismissAllowed.hasClass("nui-message-allow-dismiss")).toBe(true);
        expect(await messageDismissNotAllowed.hasClass("nui-message-allow-dismiss")).toBe(false);
    });

    it ("should have icon based on 'type' attribute", async () => {
        expect(await messageDismissAllowed.getStatusIcon().getName()).toEqual("severity_ok");
        expect(await messageDismissNotAllowed.getStatusIcon().getName()).toEqual("severity_warning");
    });

    it("should be dismissed after 'click'", async () => {
        expect(await messageDismissAllowed.isVisible()).toBe(true);
        await messageDismissAllowed.dismissMessage();
        expect(await messageDismissAllowed.isPresent()).toBe(false);
    });

    it("message should disappear after click on 'Toggle state of message' button", async () => {
        expect(await messageManualControl.isVisible()).toBe(true);        
        await manualControlToggle.click();
        await browser.wait(ExpectedConditions.invisibilityOf(messageManualControl.getElement()));
        expect(await messageManualControl.isVisible()).toBe(false);
    });
});