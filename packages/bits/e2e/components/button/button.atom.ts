import { Atom } from "../../atom";
import { Helpers } from "../../setup";

export class ButtonAtom extends Atom {
    public static CSS_CLASS = "nui-button";

    public isIconShown = async (): Promise<boolean> =>
        await this.locator
            .locator(Helpers.page.locator("nui-icon"))
            .isVisible();

    public isNotBusy = async (): Promise<void> =>
        await this.toNotContainClass("is-busy");
    public isBusy = async (): Promise<void> =>
        await this.toContainClass("is-busy");
    public click = async (): Promise<void> => this.locator.click();
}
