import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { by } from "protractor";

import { WidgetAtom } from "./widget.atom";

export class DashboardAtom extends Atom {
    public static CSS_CLASS = "nui-dashboard";

    private root = this.getElement();

    public getWidgetByIndex = (index: number): WidgetAtom => Atom.findIn<WidgetAtom>(WidgetAtom, this.root, index);

    public getWidgetById = (id: string): WidgetAtom => Atom.findIn<WidgetAtom>(WidgetAtom, this.root.element(by.css(`nui-widget[widget-id=${id}]`)));
}
