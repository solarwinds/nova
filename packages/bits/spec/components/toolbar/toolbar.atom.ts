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

import { by, ElementArrayFinder } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { MenuAtom } from "../menu/menu.atom";
import { PopupAtom } from "../popup/popup.atom";

export class ToolbarAtom extends Atom {
    public static CSS_CLASS = "nui-toolbar";

    public popup = Atom.findIn(PopupAtom, this.getElement());

    public async isPresent(): Promise<boolean> {
        return super.getElement().isPresent();
    }

    private getAllVisibleItems(): ElementArrayFinder {
        return super
            .getElement()
            .all(by.css(".nui-toolbar-content__dynamic > .nui-button"));
    }

    public async getAllVisibleItemsCount(): Promise<number> {
        return this.getAllVisibleItems().count();
    }

    public getToolbarItemButton(index: number): ButtonAtom {
        return Atom.findIn(ButtonAtom, this.getAllVisibleItems().get(index));
    }

    public getToolbarMenu(): MenuAtom {
        return Atom.findIn(
            MenuAtom,
            this.getElement().element(by.className("nui-menu"))
        );
    }

    public async getToolbarBackground(): Promise<string> {
        return super.getElement().getCssValue("background-color");
    }

    public async getSelectedStateText(): Promise<string> {
        return super
            .getElement()
            .element(by.className("nui-toolbar-content__select"))
            .getText();
    }

    public getToolbarMessages(): ElementArrayFinder {
        return this.getElement().all(by.tagName("nui-toolbar-message"));
    }

    public async getToolbarMessagesTexts(): Promise<string[]> {
        return await this.getToolbarMessages().map<string>(async (el) =>
            el?.getText()
        );
    }
}
