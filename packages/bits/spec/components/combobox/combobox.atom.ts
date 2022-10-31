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

import { browser, by, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { IconAtom } from "../icon/icon.atom";
import { PopupAtom } from "../popup/popup.atom";
import { BasicSelectAtom } from "../select/basic-select.atom";
import { TextboxAtom } from "../textbox/textbox.atom";

export class ComboboxAtom extends BasicSelectAtom {
    public static CSS_CLASS = "nui-combobox";

    private root = this.getElement();
    private containerFinder = this.root
        .all(by.className("nui-combobox__container"))
        .first();
    private textboxFinder = this.containerFinder
        .all(by.className("nui-combobox__input"))
        .first();

    public iconAtom = Atom.findIn(
        IconAtom,
        this.root.all(by.className("nui-combobox__icon")).first()
    );
    public textbox = Atom.findIn(TextboxAtom, this.textboxFinder);
    public clearButton = Atom.findIn(
        ButtonAtom,
        this.containerFinder
            .all(by.className("nui-combobox__remove-value"))
            .first()
    );
    public toggleButton = Atom.findIn(
        ButtonAtom,
        this.containerFinder.all(by.className("nui-combobox__toggle")).first()
    );
    public popup = Atom.findIn(
        PopupAtom,
        browser.element(by.className("nui-combobox-popup-host"))
    );

    public getIconName = async (): Promise<string> => this.iconAtom.getName();

    public getContainer = (): ElementFinder => this.containerFinder;

    public toggleMenu = async (): Promise<void> => this.toggleButton.click();

    public getComboboxPlaceholder = async (): Promise<string> =>
        this.textbox.input.getAttribute("placeholder");

    public getInput = (): ElementFinder => this.textbox.input;

    public acceptText = async (text: string): Promise<void> => {
        await this.textbox.clearText();
        return this.textbox.acceptText(text);
    };

    public getInputValue = async (): Promise<string> => this.textbox.getValue();

    public clearText = async (): Promise<void> => this.textbox.clearText();

    public acceptInput = async (input: string) =>
        this.textbox.acceptText(input);

    public getLayoutBlock = (): ElementFinder =>
        this.getElementByClass("nui-combobox__layout-block");

    public isRequiredStyleDisplayed = async (): Promise<boolean> =>
        this.elementHasClass("nui-combobox__container", "has-error");

    public getHighlightedItemsCount = async (): Promise<number> =>
        this.root.all(by.className("nui-highlighted")).count();
}
