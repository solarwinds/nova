import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CheckboxGroupComponent } from "./checkbox-group.component";
import { NuiFormFieldModule } from "../form-field/form-field.module";

@Component({
    template: `
        <span id="external-heading">Vegetables available</span>
        <nui-form-field [caption]="caption">
            <nui-checkbox-group
                [values]="[]"
                [ariaLabel]="name"
                [ariaLabelledby]="labelledby">
            </nui-checkbox-group>
        </nui-form-field>
        <button data-test="name" (click)="name = 'Vegetables available'">Name</button>
        <button data-test="caption" (click)="caption = 'Vegetables to buy'; name = 'Vegetables to buy this week'">Caption</button>
        <button data-test="reference" (click)="labelledby = 'external-heading'">Reference</button>
        <button data-test="clear" (click)="labelledby = ''; name = ''">Clear</button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
class CheckboxGroupFormHost {
    public caption = "Vegetables";
    public name: string;
    public labelledby = "";
}

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

describe("checkbox-group inside a form field", () => {
    it("uses an explicit name or reference before the changing caption", async () => {
        TestBed.configureTestingModule({
            declarations: [CheckboxGroupComponent, CheckboxGroupFormHost],
            imports: [NuiFormFieldModule],
        });
        const fixture = TestBed.createComponent(CheckboxGroupFormHost);
        fixture.autoDetectChanges();
        await fixture.whenStable();
        const group = fixture.nativeElement.querySelector(
            "nui-checkbox-group"
        ) as HTMLElement;

        expect(group.getAttribute("aria-label")).toBe("Vegetables");
        fixture.nativeElement.querySelector("[data-test=name]").click();
        await fixture.whenStable();
        expect(group.getAttribute("aria-label")).toBe("Vegetables available");

        fixture.nativeElement.querySelector("[data-test=caption]").click();
        await fixture.whenStable();
        expect(group.getAttribute("aria-label")).toBe(
            "Vegetables to buy this week"
        );

        fixture.nativeElement.querySelector("[data-test=reference]").click();
        await fixture.whenStable();
        expect(group.getAttribute("aria-labelledby")).toBe("external-heading");

        fixture.nativeElement.querySelector("[data-test=clear]").click();
        await fixture.whenStable();
        expect(group.getAttribute("aria-label")).toBe("Vegetables to buy");
        expect(group.hasAttribute("aria-labelledby")).toBeFalse();
    });
});
