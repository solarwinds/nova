import { IconAtom } from "./icon.atom";
import { Atom } from "../../atom";
import { test, Helpers, expect } from "../../setup";

test.describe("USERCONTROL icon", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("icon", page);
    });

    test("should show each available icon size on the page", async () => {
        const smallIcon = Atom.find<IconAtom>(IconAtom, "nui-demo-icon-small");
        expect(await smallIcon.getSize()).toEqual(IconAtom.iconSize.small);

        const defaultIcon = Atom.find<IconAtom>(
            IconAtom,
            "nui-demo-icon-default-size"
        );
        expect(await defaultIcon.getSize()).toEqual(IconAtom.iconSize.default);

        const mediumIcon = Atom.find<IconAtom>(
            IconAtom,
            "nui-demo-icon-medium-size"
        );
        expect(await mediumIcon.getSize()).toEqual(IconAtom.iconSize.medium);
    });

    test("should show icons with status on the page", async () => {
        const atom = Atom.find<IconAtom>(
            IconAtom,
            "nui-demo-icon-with-status-up"
        );
        expect(await atom.getStatus()).toEqual("up");
    });

    test("should show icons with valid counters on the page", async () => {
        const atom = Atom.find<IconAtom>(
            IconAtom,
            "nui-demo-icon-with-counter"
        );
        expect(await atom.getCounter()).toEqual("6");
    });

    test("should have 'icon' attr congruent to the 'icon' prop binding", async () => {
        const statusIcon = Atom.find<IconAtom>(
            IconAtom,
            "nui-demo-icon-with-status-up"
        );
        expect(await statusIcon.getName()).toEqual("add");
        const addIcon = Atom.find<IconAtom>(IconAtom, "nui-demo-icon-small");
        expect(await addIcon.getName()).toEqual("add");
    });

    test("should recolor icon to orange color", async () => {
        const iconColor = Atom.find<IconAtom>(IconAtom, "nui-demo-icon-color");
        expect(iconColor.getIconByCssClass("orange-icon")).toBeTruthy();
    });

    test("should recolor icon on hover effect to gray color", async () => {
        const iconHover = Atom.find<IconAtom>(IconAtom, "nui-demo-icon-hover");
        expect(iconHover.getIconByCssClass("gray-hover-icon")).toBeTruthy();
    });
});
