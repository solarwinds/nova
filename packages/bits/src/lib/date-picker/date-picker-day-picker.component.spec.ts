import _isUndefined from "lodash/isUndefined";
import _keys from "lodash/keys";
import moment from "moment/moment";

import { DayPickerComponent } from "./date-picker-day-picker.component";
import { DatePickerInnerComponent } from "./date-picker-inner.component";

describe("components >", () => {
    describe("daypicker >", () => {
        let inner: DatePickerInnerComponent;
        let dayPicker: DayPickerComponent;

        beforeEach(() => {
            inner = new DatePickerInnerComponent();
            dayPicker = new DayPickerComponent(inner);
        });

        it("should check setting year step", () => {
            expect(_keys(inner.stepDay).length).toBe(0);
            dayPicker.ngOnInit();
            expect(_keys(inner.stepDay).length).toBe(1);
            expect(inner.stepDay.months).toBe(1);
        });

        it("should check if refreshView handler for day has been set", () => {
            expect(_isUndefined((inner as any).refreshViewHandlerYear)).toBeTruthy();
            spyOn(inner, "setRefreshViewHandler");
            spyOn(inner, "setCompareHandler");
            dayPicker.ngOnInit();
            expect(inner.setRefreshViewHandler).toHaveBeenCalled();
            expect(inner.setCompareHandler).toHaveBeenCalled();
        });

        it("should get dates", () => {
            const date = moment({year: 2018, month: 1, date: 2});
            const dates = (dayPicker as any).getDates(date, 10);
            const last = dates.length - 1;
            expect(moment(dates[0].date).isSame(date)).toBe(true);
            expect(moment(dates[last].date).isSame(moment({year: 2018, month: 1, date: 11}))).toBe(true);
            expect(dates.length).toBe(10);
        });

        it("should get dates (preserving insignificant)", () => {
            inner.preserveInsignificant = true;
            const date = moment({year: 2018, month: 1, date: 2, hour: 2, minute: 2, second: 2});
            const dates = (dayPicker as any).getDates(date, 10);
            const last = dates.length - 1;
            expect(moment(dates[0].date).isSame(date)).toBe(true);
            expect(moment(dates[last].date).isSame(moment({year: 2018, month: 1, date: 11, hour: 2, minute: 2, second: 2}))).toBe(true);
            expect(dates.length).toBe(10);
        });
    });
});
