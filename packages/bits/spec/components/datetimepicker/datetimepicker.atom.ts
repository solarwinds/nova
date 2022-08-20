import { Atom } from "../../atom";
import { DatepickerAtom } from "../datepicker/datepicker.atom";
import { TimepickerAtom } from "../timepicker/timepicker.atom";

export class DateTimepickerAtom extends Atom {
    public static CSS_CLASS = "nui-datetime-picker";

    public getDatePicker(): DatepickerAtom {
        return DatepickerAtom.findIn(DatepickerAtom, this.getElement());
    }

    public getTimePicker(): TimepickerAtom {
        return TimepickerAtom.findIn(TimepickerAtom, this.getElement());
    }

    public async isDisabled(): Promise<boolean> {
        return (
            (await this.getDatePicker().isDisabled()) &&
            (await this.getTimePicker().textbox.disabled())
        );
    }
}
