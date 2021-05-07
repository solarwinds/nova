import { ChangeDetectorRef } from "@angular/core";

import { RawFormatterComponent } from "./raw-formatter.component";

describe("TableWidgetComponent", () => {
    let component: RawFormatterComponent;

    beforeEach(() => {
        component = new RawFormatterComponent({} as unknown as ChangeDetectorRef);
    });

    describe("displayValue > ", () => {
        it("should be a localized number", () => {
            component.data = { value: 5000 };
            expect(component.displayValue).toEqual((5000).toLocaleString())
        });

        it("should preserve the original value of a non-number", () => {
            component.data = { value: "test" };
            expect(component.displayValue).toEqual("test")
        });
    });
});
