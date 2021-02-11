import { Component, Input, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChartDonutContentPlugin } from "../core/plugins/chart-donut-content-plugin";

import { ChartDonutContentComponent } from "./chart-donut-content.component";

// since Angular doesn't fire ngOnChanges while creating component directly, we have to use wrapper component
@Component({
    selector: "nui-chart-content-wrapper",
    template: `<nui-chart-donut-content [plugin]="plugin"></nui-chart-donut-content>`,
})
class ChartContentWrapper {
    @Input() plugin: ChartDonutContentPlugin;
    @ViewChild(ChartDonutContentComponent) donutContent: ChartDonutContentComponent;
}

describe("components >", () => {
    describe("chart-donut-content >", () => {
        let fixture: ComponentFixture<ChartContentWrapper>;
        let component: ChartContentWrapper;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ChartContentWrapper,
                    ChartDonutContentComponent,
                ],
            });

            fixture = TestBed.createComponent(ChartContentWrapper);
            component = fixture.componentInstance;

            component.plugin = new ChartDonutContentPlugin();
            component.plugin.chart = <any>{ updateDimensions: () => {}};

            fixture.detectChanges();
        });

        describe("contentPosition >", () => {
            it("should be updated on plugin content position update", () => {
                const expectedContentPosition = { top: 1, left: 1, width: 1, height: 1 };
                expect(component.donutContent.contentPosition).toBeUndefined();
                component.plugin.contentPositionUpdateSubject.next(expectedContentPosition);
                expect(component.donutContent.contentPosition).toEqual(expectedContentPosition);
            });
        });

    });
});
