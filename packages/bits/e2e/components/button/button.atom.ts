import { Atom, IAtomClass } from "../../atom";
import { Helpers } from "../../setup";
import { Locator } from "playwright-core";

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
}
