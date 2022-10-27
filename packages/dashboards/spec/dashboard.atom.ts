// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { by, ElementFinder } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

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
