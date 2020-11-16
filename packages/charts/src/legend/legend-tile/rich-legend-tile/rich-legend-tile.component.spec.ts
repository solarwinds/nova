import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { LegendSeriesComponent } from "../../legend-series/legend-series.component";
import { LegendComponent } from "../../legend.component";

import { RichLegendTileComponent } from "./rich-legend-tile.component";

const testLegendSeriesUnitLabel = "Mbps";
const testLegendSeriesColor = "fallback-legend-color";

describe("components >", () => {
    describe("rich-legend-tile >", () => {
        let fixture: ComponentFixture<RichLegendTileComponent>;
        let tile: RichLegendTileComponent;
        let element: HTMLElement;
        let testLegendComponent: LegendComponent;
        let testLegendSeriesComponent: LegendSeriesComponent;

        const prepareComponent = (testLegend: LegendComponent, testLegendSeries: LegendSeriesComponent) => {
            TestBed.overrideComponent(
                RichLegendTileComponent,
                { set: { providers: [
                    { provide: LegendComponent, useValue: testLegend },
                    { provide: LegendSeriesComponent, useValue: testLegendSeries },
                ] } }
            );
            fixture = TestBed.createComponent(RichLegendTileComponent);
            tile = fixture.debugElement.componentInstance;
            element = fixture.debugElement.query(By.css(".nui-rich-legend-tile")).nativeElement;

            fixture.autoDetectChanges();
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    RichLegendTileComponent,
                    LegendSeriesComponent,
                    LegendComponent,
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });

            testLegendComponent = new LegendComponent();
            testLegendSeriesComponent = new LegendSeriesComponent(testLegendComponent);
        });

        describe("template conditionals >", () => {
            it("should not have 'nui-rich-legend-tile--series-has-additional-content' class by default", () => {
                prepareComponent(testLegendComponent, testLegendSeriesComponent);
                expect(element.classList).not.toContain("nui-rich-legend-tile--series-has-additional-content");
            });

            it("should add 'nui-rich-legend-tile--series-has-additional-content' class when the series has a description", () => {
                testLegendSeriesComponent.hasInputDescription = () => true;
                prepareComponent(testLegendComponent, testLegendSeriesComponent);
                expect(element.classList).toContain("nui-rich-legend-tile--series-has-additional-content");
            });

            it("should add 'nui-rich-legend-tile--series-has-additional-content' class when the series has projected right content", () => {
                testLegendSeriesComponent.hasProjectedDescription = () => true;
                prepareComponent(testLegendComponent, testLegendSeriesComponent);
                expect(element.classList).toContain("nui-rich-legend-tile--series-has-additional-content");
            });
        });

        describe("input handling logic >", () => {

            it("should use the unit label from the parent legend seriesUnitLabel input", () => {
                testLegendComponent.seriesUnitLabel = testLegendSeriesUnitLabel;
                prepareComponent(testLegendComponent, testLegendSeriesComponent);
                expect(tile.unitLabel).toEqual(testLegendSeriesUnitLabel);
            });

            it("should use the unit label from series label input", () => {
                const seriesSpecificUnitLabel = "%";

                testLegendComponent.seriesUnitLabel = testLegendSeriesUnitLabel;
                prepareComponent(testLegendComponent, testLegendSeriesComponent);
                tile.unitLabel = seriesSpecificUnitLabel;
                fixture.detectChanges();

                expect(tile.unitLabel).toEqual(seriesSpecificUnitLabel);
            });

            it("should use the color value from the parent legend seriesColor input", () => {
                testLegendComponent.seriesColor = testLegendSeriesColor;
                prepareComponent(testLegendComponent, testLegendSeriesComponent);
                expect(tile.backgroundColor).toEqual(testLegendSeriesColor);
            });

            it("should use the color value from series color input", () => {
                const seriesSpecificColor = "series-specific-color";
                testLegendComponent.seriesColor = testLegendSeriesColor;
                prepareComponent(testLegendComponent, testLegendSeriesComponent);
                tile.backgroundColor = seriesSpecificColor;
                fixture.detectChanges();

                expect(tile.backgroundColor).toEqual(seriesSpecificColor);
            });

        });

        describe("initialization from parent series >", () => {
            describe("series additional content", () => {
                it("should report that the parent series does not have additional content", () => {
                    prepareComponent(testLegendComponent, testLegendSeriesComponent);
                    expect(tile.seriesHasAdditionalContent).toEqual(false);
                });

                it("should report that the parent series has additional content when the series has a description", () => {
                    spyOn(testLegendSeriesComponent, "hasInputDescription").and.returnValue(true);
                    prepareComponent(testLegendComponent, testLegendSeriesComponent);
                    expect(tile.seriesHasAdditionalContent).toEqual(true);
                });

                it("should report that the parent series has additional content when the series has projected right content", () => {
                    spyOn(testLegendSeriesComponent, "hasProjectedDescription").and.returnValue(true);
                    prepareComponent(testLegendComponent, testLegendSeriesComponent);
                    expect(tile.seriesHasAdditionalContent).toEqual(true);
                });
            });
        });
    });
});
