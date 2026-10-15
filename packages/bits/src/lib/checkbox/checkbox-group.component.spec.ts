import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CheckboxGroupComponent } from "./checkbox-group.component";

describe("components > checkbox-group > naming relationships", () => {
    let fixture: ComponentFixture<CheckboxGroupComponent>;
    let host: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CheckboxGroupComponent],
        });
        fixture = TestBed.createComponent(CheckboxGroupComponent);
        fixture.componentRef.setInput("values", []);
        fixture.detectChanges();
        host = fixture.nativeElement;
    });

    it("should apply and update the supplied label on the group role owner", () => {
        expect(host.getAttribute("role")).toBe("group");
        expect(host.getAttribute("aria-label")).toBe("Checkbox Group");
        fixture.componentRef.setInput("ariaLabel", "Vegetables");
        fixture.detectChanges();
        expect(host.getAttribute("aria-label")).toBe("Vegetables");
        expect(
            host
                .querySelector(".nui-checkbox-group")
                ?.hasAttribute("aria-label")
        ).toBeFalse();

        fixture.componentRef.setInput("ariaLabel", "");
        fixture.detectChanges();
        expect(host.hasAttribute("aria-label")).toBeFalse();
    });

    it("should apply, update and remove label references on the group role owner", () => {
        fixture.componentRef.setInput("ariaLabelledby", "vegetables-heading");
        fixture.detectChanges();
        expect(host.getAttribute("aria-labelledby")).toBe("vegetables-heading");
        expect(
            host
                .querySelector(".nui-checkbox-group")
                ?.hasAttribute("aria-labelledby")
        ).toBeFalse();

        fixture.componentRef.setInput("ariaLabelledby", "filters-heading");
        fixture.detectChanges();
        expect(host.getAttribute("aria-labelledby")).toBe("filters-heading");

        fixture.componentRef.setInput("ariaLabelledby", "");
        fixture.detectChanges();
        expect(host.hasAttribute("aria-labelledby")).toBeFalse();
    });
});
