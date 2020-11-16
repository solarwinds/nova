import _isUndefined from "lodash/isUndefined";
import _keys from "lodash/keys";

import { DatePickerInnerComponent } from "./date-picker-inner.component";
import { MonthPickerComponent } from "./date-picker-month-picker.component";

describe("components >", () => {
    describe("monthpicker >", () => {
        let inner: DatePickerInnerComponent;
        let monthPicker: MonthPickerComponent;

        beforeEach(() => {
            inner = new DatePickerInnerComponent();
            monthPicker = new MonthPickerComponent(inner);
        });

        it("should check setting year step", () => {
            expect(_keys(inner.stepMonth).length).toBe(0);
            monthPicker.ngOnInit();
            expect(_keys(inner.stepMonth).length).toBe(1);
            expect(inner.stepMonth.years).toBe(1);
        });

        it("should check if refreshView handler for month has been set", () => {
            expect(_isUndefined((inner as any).refreshViewHandlerYear)).toBeTruthy();
            spyOn(inner, "setRefreshViewHandler");
            spyOn(inner, "setCompareHandler");
            monthPicker.ngOnInit();
            expect(inner.setRefreshViewHandler).toHaveBeenCalled();
            expect(inner.setCompareHandler).toHaveBeenCalled();
        });
    });
});
