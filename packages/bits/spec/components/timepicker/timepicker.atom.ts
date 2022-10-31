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

import moment from "moment/moment";
import { by, element } from "protractor";

import { Atom } from "../../atom";
import { IconAtom } from "../icon/icon.atom";
import { MenuPopupAtom } from "../menu-popup/menu-popup.atom";
import { OverlayAtom } from "../overlay/overlay.atom";
import { TextboxAtom } from "../textbox/textbox.atom";

export class TimepickerAtom extends Atom {
    public static CSS_CLASS = "nui-timepicker";

    public static defaultFormat = "LT";

    public static isCorrectTimeFormat = (
        timeString: string,
        format: string
    ): boolean => moment(timeString, format, true).isValid();

    public static createTimeString = (
        hour: number,
        minute: number,
        format = TimepickerAtom.defaultFormat
    ): string => {
        const date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        return moment(date).format(format);
    };

    public textbox = Atom.findIn(TextboxAtom, this.getElement());

    public menuPopup = Atom.findIn(MenuPopupAtom, this.getElement());

    public icon = Atom.findIn(IconAtom, this.getElement());

    public overlay = Atom.findIn(
        OverlayAtom,
        element(by.className("nui-timepicker__menu"))
    );

    public toggle = async (): Promise<void> =>
        this.getElement()
            .element(by.className("nui-timepicker__container"))
            .click();

    public selectTime = async (time: string): Promise<void> => {
        await this.toggle();
        return this.menuPopup.clickItemByText(time);
    };

    public getHighlightedMenuValue = async (): Promise<string> => {
        await this.toggle();
        return this.menuPopup.getSelectedItem().getText();
    };
}
