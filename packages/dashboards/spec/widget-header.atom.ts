import { Atom, ButtonAtom, MenuAtom } from "@solarwinds/nova-bits/sdk/atoms";
import { by } from "protractor";

export class WidgetHeaderAtom extends Atom {
    public static CSS_CLASS = "nui-widget-header";

    private root = this.getElement();

    public get menu(): MenuAtom {
        return Atom.findIn(MenuAtom, this.root);
    }

    public async clickEdit() {
        return Atom.findIn(ButtonAtom, this.root.element(by.className("nui-widget-header__action-edit"))).click();
    }
}
