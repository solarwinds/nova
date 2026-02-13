import { Locator } from "playwright-core";

import { Atom, IAtomClass } from "../../atom";
import { Helpers } from "../../setup";
import { IconAtom } from "../icon/icon.atom";

export class ButtonAtom extends Atom {
    public static CSS_CLASS = "nui-button";

    public static findIn<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentLocator: Locator,
        root = true
    ): T {
        return Atom.findIn(atomClass, parentLocator, root);
    }

    public isIconShown = async (): Promise<boolean> =>
        await this.getLocator()
            .locator(Helpers.page.locator("nui-icon"))
            .isVisible();

    public isNotBusy = async (): Promise<void> =>
        await this.toNotContainClass("is-busy");
    public isBusy = async (): Promise<void> =>
        await this.toContainClass("is-busy");
    public click = async (): Promise<void> => this.getLocator().click();

    // New interaction helpers for visual tests
    public hover = async (): Promise<void> => {
        await this.getLocator().hover();
    };

    public mouseDown = async (): Promise<void> => {
        const box = await this.getLocator().boundingBox();
        if (box) {
            await Helpers.page.mouse.move(
                box.x + box.width / 2,
                box.y + box.height / 2
            );
            await Helpers.page.mouse.down();
        }
    };

    public mouseUp = async (): Promise<void> => {
        await Helpers.page.mouse.up();
    };

    public async isDisabled(): Promise<boolean> {
        const disabled = await this.getLocator().getAttribute("disabled");
        return disabled !== null;
    }
    public getIcon = (): IconAtom =>
        Atom.findIn<IconAtom>(IconAtom, this.getLocator());
}
