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

    public static isCorrectTimeFormat = (timeString: string, format: string): boolean =>
        moment(timeString, format, true).isValid()

    public static createTimeString = (hour: number, minute: number, format = TimepickerAtom.defaultFormat): string => {
        const date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        return moment(date).format(format);
    }

    public textbox = Atom.findIn(TextboxAtom, this.getElement());

    public menuPopup = Atom.findIn(MenuPopupAtom, this.getElement());

    public icon = Atom.findIn(IconAtom, this.getElement());

    public overlay = Atom.findIn(OverlayAtom, element(by.className("nui-timepicker__menu")));

    public toggle = async (): Promise<void> => this.getElement().element(by.className("nui-timepicker__container")).click();

    public selectTime = async (time: string): Promise<void> => {
        await this.toggle();
        return this.menuPopup.clickItemByText(time);
    }

    public getHighlightedMenuValue = async (): Promise<string> => {
        await this.toggle();
        return this.menuPopup.getSelectedItem().getText();
    }
}
