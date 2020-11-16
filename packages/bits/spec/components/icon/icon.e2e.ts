import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { IconAtom } from "../public_api";

describe("USERCONTROL icon", () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("icon");
    });

    it("should show each available icon size on the page", async () => {
        const smallIcon = Atom.find(IconAtom, "nui-demo-icon-small");
        expect(await smallIcon.getSize()).toEqual(IconAtom.iconSize.small);

        const defaultIcon = Atom.find(IconAtom, "nui-demo-icon-default-size");
        expect(await defaultIcon.getSize()).toEqual(IconAtom.iconSize.default);

        const mediumIcon = Atom.find(IconAtom, "nui-demo-icon-medium-size");
        expect(await mediumIcon.getSize()).toEqual(IconAtom.iconSize.medium);
    });

    it("should show icons with status on the page", async () => {
        const atom = Atom.find(IconAtom, "nui-demo-icon-with-status-up");
        expect(await atom.getStatus()).toEqual("up");
    });

    it("should show icons with valid counters on the page", async () => {
        const atom = Atom.find(IconAtom, "nui-demo-icon-with-counter");
        expect(await atom.getCounter()).toEqual("6");
    });

    it("should have 'icon' attr congruent to the 'icon' prop binding", async () => {
        const statusIcon = Atom.find(IconAtom, "nui-demo-icon-with-status-up");
        expect(await statusIcon.getName()).toEqual("add");
        const addIcon = Atom.find(IconAtom, "nui-demo-icon-small");
        expect(await addIcon.getName()).toEqual("add");
    });

    it("should recolor icon to orange color", async () => {
        const iconColor = Atom.find(IconAtom, "nui-demo-icon-color");
        expect(iconColor.getIconByCssClass("orange-icon")).toBeTruthy();
    });

    it("should recolor icon on hover effect to gray color", async () => {
        const iconHover = Atom.find(IconAtom, "nui-demo-icon-hover");
        expect(iconHover.getIconByCssClass("gray-hover-icon")).toBeTruthy();
    });
});
