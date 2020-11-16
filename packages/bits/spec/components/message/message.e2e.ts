import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { MessageAtom } from "../public_api";

describe("USERCONTROL Message", () => {
    let messageDismissAllowed: MessageAtom;
    let messageDismissNotAllowed: MessageAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("message/message-test");

        messageDismissAllowed = Atom.find(MessageAtom, "nui-demo-message-dismiss-allowed");
        messageDismissNotAllowed = Atom.find(MessageAtom, "nui-demo-message-dismiss-not-allowed");
    });

    it("should be visible", async () => {
        expect(await messageDismissAllowed.isVisible()).toBe(true);
    });

    it("should always have .nui-message class", async () => {
        expect(await messageDismissAllowed.hasClass("nui-message")).toBe(true);
        expect(await messageDismissNotAllowed.hasClass("nui-message")).toBe(true);
    });

    it("should have background color depending on 'type' attribute", async () => {
        expect(await messageDismissAllowed.getBackgroundColor()).toBe("rgba(230, 246, 238, 1)");
    });

    it("should have border style depending on 'type' attribute", async () => {
        expect(await messageDismissAllowed.getBorderStyle()).toBe("rgb(0, 167, 83)");
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

    it("should show dismiss button when allowed", async () => {
        expect(await messageDismissAllowed.isDismissable()).toBe(true);
    });

    it("shouldn\'t show dismiss button when not allowed", async () => {
        expect(await messageDismissNotAllowed.getDismissButton().isPresent()).toBe(false);
    });

    it("should be dismissed after 'click'", async () => {
        expect(await messageDismissAllowed.isVisible()).toBe(true);
        await messageDismissAllowed.dismissMessage();
        expect(await messageDismissAllowed.isPresent()).toBe(false);
    });

});
