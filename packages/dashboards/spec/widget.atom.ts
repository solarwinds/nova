import { Atom } from "@nova-ui/bits/sdk/atoms";

import { WidgetHeaderAtom } from "./widget-header.atom";

export class WidgetAtom extends Atom {
    public static CSS_CLASS = "nui-widget";

    private root = this.getElement();

    public get header(): WidgetHeaderAtom {
        return Atom.findIn(WidgetHeaderAtom, this.root);
    }
}
