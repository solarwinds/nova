import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { LegendComponent } from "./legend.component";
import { LegendOrientation } from "./types";

describe("components >", () => {
    describe("legend >", () => {
        let fixture: ComponentFixture<LegendComponent>;
        let legend: LegendComponent;
        let element: HTMLElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [LegendComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });

            fixture = TestBed.createComponent(LegendComponent);
            legend = fixture.debugElement.componentInstance;
            element = fixture.debugElement.query(
                By.css(".nui-legend")
            ).nativeElement;
            fixture.detectChanges();
        });

        it("should emit active changed with the new active value", () => {
            legend.active = false;

            spyOn(legend.activeChanged, "emit");
            legend.active = true;

            legend.ngOnChanges({
                active: new SimpleChange(null, null, legend.active),
            });

            expect(legend.activeChanged.emit).toHaveBeenCalledWith(true);
        });

        it("should have 'flex-column' class by default", () => {
            expect(element.classList).toContain("flex-column");
        });

        it("should remove 'flex-column' class if orientation is horizaontal", () => {
            legend.orientation = LegendOrientation.horizontal;
            fixture.detectChanges();
            expect(element.classList).not.toContain("flex-column");
        });
    });
});
