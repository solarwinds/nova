import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChartDonutContentPlugin } from "../core/plugins/chart-donut-content-plugin";

import { ChartDonutContentComponent } from "./chart-donut-content.component";

describe("components >", () => {
    describe("chart-donut-content >", () => {
        let fixture: ComponentFixture<ChartDonutContentComponent>;
        let component: ChartDonutContentComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ChartDonutContentComponent,
                ],
            });
            fixture = TestBed.createComponent(ChartDonutContentComponent);
            component = fixture.componentInstance;
            component.plugin = new ChartDonutContentPlugin();
            component.plugin.chart = <any>{ updateDimensions: () => {}};
            fixture.detectChanges();
        });

        describe("contentPosition >", () => {
            it("should be updated on plugin content position update", () => {
                const expectedContentPosition = { top: 1, left: 1, width: 1, height: 1 };
                expect(component.contentPosition).toBeUndefined();
                component.plugin.contentPositionUpdateSubject.next(expectedContentPosition);
                expect(component.contentPosition).toEqual(expectedContentPosition);
            });
        });

    });
});
