import { SimpleChange } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
} from "@angular/core/testing";
import { NuiPopoverModule } from "@nova-ui/bits";

import { ChartTooltipsPlugin } from "../core/plugins/tooltips";

import { ChartTooltipComponent } from "./chart-tooltip.component";
import { ChartTooltipDirective } from "./chart-tooltip.directive";
import { ChartTooltipsComponent } from "./chart-tooltips.component";

describe("ChartTooltipsComponent", () => {
    let component: ChartTooltipsComponent;
    let fixture: ComponentFixture<ChartTooltipsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                ChartTooltipsComponent,
                ChartTooltipDirective,
                ChartTooltipComponent,
            ],
            imports: [NuiPopoverModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartTooltipsComponent);
        component = fixture.componentInstance;
        component.plugin = new ChartTooltipsPlugin();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("hideSubject observer", () => {
        it("should emit the closeTooltips subject after a timeout", fakeAsync(() => {
            component.ngOnChanges({
                plugin: new SimpleChange(null, component.plugin, true),
            });
            spyOn(component.closeTooltips, "next");
            component.plugin.hideSubject.next();

            expect(component.closeTooltips.next).not.toHaveBeenCalled();
            flush();
            expect(component.closeTooltips.next).toHaveBeenCalled();
        }));
    });
});
