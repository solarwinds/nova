import { by } from "protractor";

import { Atom } from "../../atom";
import { DateTimepickerAtom } from "../datetimepicker/datetimepicker.atom";

export class TimeFramePickerAtom extends Atom {
    public static CSS_CLASS = "nui-time-frame-picker";

    public getStartDatetimePicker(): DateTimepickerAtom {
        return Atom.findIn(DateTimepickerAtom,
                this.getElement().element(by.className("nui-time-frame-picker__date-time_start")));
    }

    public getEndDatetimePicker(): DateTimepickerAtom {
        return Atom.findIn(DateTimepickerAtom,
            this.getElement().element(by.className("nui-time-frame-picker__date-time_end")));
    }
}
