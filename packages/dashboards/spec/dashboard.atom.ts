import { Atom } from "@nova-ui/bits/sdk/atoms";
import { by, ElementFinder } from "protractor";

import { WidgetAtom } from "./widget.atom";

export class DashboardAtom extends Atom {
    public static CSS_CLASS = "nui-dashboard";

    private root = this.getElement();

    public getWidgetByIndex = (index: number): WidgetAtom =>
        Atom.findIn<WidgetAtom>(WidgetAtom, this.root, index);

    public getWidgetById = (id: string): WidgetAtom =>
        Atom.findIn<WidgetAtom>(
            WidgetAtom,
            this.root.element(by.css(`nui-widget[widget-id=${id}]`))
        );

    public async getWidgetByHeaderTitleText(
        text: string,
        isSubstring = false
    ): Promise<WidgetAtom | undefined> {
        const widgets = this.root.all(by.className("nui-widget"));
        let widget: ElementFinder | undefined;
        await widgets.each(async (element: ElementFinder | undefined) => {
            const headerTitleText = await element
                ?.element(by.className("nui-widget__header__content-title"))
                .getText();
            if (
                (isSubstring && headerTitleText?.includes(text)) ||
                headerTitleText === text
            ) {
                widget = element;
            }
        });

        if (widget) {
            return Atom.findIn<WidgetAtom>(WidgetAtom, widget);
        }
    }
}
