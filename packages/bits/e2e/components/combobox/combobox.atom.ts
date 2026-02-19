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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { IconAtom } from "../icon/icon.atom";
import { PopupAtom } from "../popup/popup.atom";
import { BasicSelectAtom } from "../select/basic-select.atom";
import { TextboxAtom } from "../textbox/textbox.atom";

export class ComboboxAtom extends BasicSelectAtom {
    public static CSS_CLASS = "nui-combobox";

    private get root(): Locator {
        return this.getLocator();
    }

    private get container(): Locator {
        return this.root.locator(".nui-combobox__container").first();
    }

    private get textboxLocator(): Locator {
        return this.container.locator(".nui-combobox__input").first();
    }

    public iconAtom: IconAtom = Atom.findIn<IconAtom>(
        IconAtom,
        this.root.locator(".nui-combobox__icon").first()
    );

    public textbox: TextboxAtom = Atom.findIn<TextboxAtom>(
        TextboxAtom,
        this.textboxLocator
    );

    public clearButton: ButtonAtom = new ButtonAtom(
        this.container.locator(".nui-combobox__remove-value").first()
    );

    public toggleButton: ButtonAtom = new ButtonAtom(
        this.container.locator(".nui-combobox__toggle").first()
    );

    public popup: PopupAtom = Atom.findIn<PopupAtom>(
        PopupAtom,
        // popup is hosted outside the combobox in a global host
        Atom.getFromRoot(".nui-combobox-popup-host")
    );

    public getIconName = async (): Promise<string> =>
        (await this.iconAtom.getName()) ?? "";

    public getContainer = (): Locator => this.container;

    public toggleMenu = async (): Promise<void> => this.toggleButton.click();

    public getComboboxPlaceholder = async (): Promise<string> =>
        (await this.textbox.input.getAttribute("placeholder")) ?? "";

    public getInput = (): Locator => this.textbox.input;

    public acceptText = async (text: string): Promise<void> => {
        await this.textbox.clearText();
        await this.textbox.acceptText(text);
    };

    public getInputValue = async (): Promise<string> =>
        this.textbox.input.inputValue();

    public clearText = async (): Promise<void> => this.textbox.clearText();

    public acceptInput = async (input: string): Promise<void> =>
        this.textbox.acceptText(input);

    public getLayoutBlock = (): Locator =>
        this.getElementByClass("nui-combobox__layout-block");

    public isRequiredStyleDisplayed = async (): Promise<boolean> =>
        this.elementHasClass("nui-combobox__container", "has-error");

    public getHighlightedItemsCount = async (): Promise<number> =>
        this.root.locator(".nui-highlighted").count();

    public async waitElementVisible(): Promise<void> {
        await this.root.first().waitFor({ state: "visible" });
    }
}
