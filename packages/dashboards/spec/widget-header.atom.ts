import { Atom, MenuAtom } from "@nova-ui/bits/sdk/atoms";

export class WidgetHeaderAtom extends Atom {
    public static CSS_CLASS = "nui-widget-header";

    private root = this.getElement();

    public get menu(): MenuAtom {
        return Atom.findIn(MenuAtom, this.root);
    }
}
