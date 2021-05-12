import { ChangeDetectorRef, SimpleChange } from "@angular/core";

import { PercentageFormatterComponent } from "./percentage-formatter.component";

describe("PercentageFormatterComponent", () => {
    let component: PercentageFormatterComponent;

    beforeEach(() => {
        component = new PercentageFormatterComponent({} as unknown as ChangeDetectorRef);
    });

    describe("displayValue > ", () => {
        it("should be a localized number without a grouping separator", () => {
            const value = 5000.11;
            component.data = { value: value };
            const spy = spyOn(Number.prototype, "toLocaleString").and.callThrough();
            component.ngOnChanges({ data: new SimpleChange(undefined, component.data, true) })
            expect(spy).toHaveBeenCalledWith(undefined, { useGrouping: false });
            expect(component.displayValue).toEqual(value.toLocaleString(undefined, { useGrouping: false }))
        });

        it("should preserve the original value of a non-number", () => {
            component.data = { value: "test" };
            component.ngOnChanges({ data: new SimpleChange(undefined, component.data, true) })
            expect(component.displayValue).toEqual("test");
        });
    });
});
