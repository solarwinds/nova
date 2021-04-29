import { Component, SimpleChange, SimpleChanges } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EventBus, IEvent } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    ChartPalette,
    defaultPalette,
    IAccessors,
    IValueProvider,
    LineAccessors,
    SET_DOMAIN_EVENT,
    XYGrid,
    ZoomPlugin,
} from "@nova-ui/charts";

import { ISerializableTimeframe } from "../../../../configurator/services/types";
import { NuiDashboardsModule } from "../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../services/provider-registry.service";
import { INTERACTION, SET_TIMEFRAME } from "../../../../services/types";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../types";
import { ITimeseriesWidgetConfig, ITimeseriesWidgetData, TimeseriesInteractionType, ITimeseriesWidgetSeriesData } from "../../types";

import { XYChartComponent } from "./xy-chart.component";

@Component({
    selector: "test-component",
    template: "",
})
class TestComponent extends XYChartComponent {
    public static lateLoadKey = "TestComponent";

    protected createAccessors(colorProvider: IValueProvider<string>): IAccessors {
        return new LineAccessors(colorProvider);
    }

    protected createChartAssist(palette: ChartPalette): ChartAssist {
        // @ts-ignore: Avoiding strict mode errors, keeping old flow
        return new ChartAssist(new Chart(new XYGrid()), null, palette);
    }
}

describe("XYChartComponent", () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    const eventBus = new EventBus<IEvent>();

    function getChart(): Chart {
        return component.chartAssist.chart as Chart;
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
                {
                    provide: DATA_SOURCE,
                    useValue: {},
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        let initializationChanges: SimpleChanges;

        beforeEach(() => {
            initializationChanges = {
                widgetData: { isFirstChange: () => false } as SimpleChange,
                configuration: { isFirstChange: () => false, currentValue: {} } as SimpleChange,
            };
        });

        it("should invoke chartAssist.update", () => {
            component.widgetData = { series: [] };
            component.ngOnChanges(initializationChanges);
            const spy = spyOn(component.chartAssist, "update");
            component.ngOnChanges({ widgetData: { isFirstChange: () => false } as SimpleChange } as SimpleChanges);
            expect(spy).toHaveBeenCalled();
        });

        it("should re-instantiate the chart if there were no series to display in the previous change detection cycle", () => {
            spyOn((<any>component), "updateChartData");

            component.widgetData = { series: [] };
            component.ngOnChanges(initializationChanges);

            const originalChart = getChart();

            component.widgetData = { series: [{} as ITimeseriesWidgetData] };
            component.ngOnChanges({ widgetData: { isFirstChange: () => false } as SimpleChange } as SimpleChanges);

            expect(originalChart).not.toBe(getChart());
        });

        it("should not re-instantiate the chart if the widget data contained one or more series in the previous change detection cycle", () => {
            spyOn((<any>component), "updateChartData");

            component.widgetData = { series: [{} as ITimeseriesWidgetData] };
            component.ngOnChanges(initializationChanges);

            const originalChart = getChart();

            component.widgetData = { series: [{} as ITimeseriesWidgetData] };
            component.ngOnChanges({ widgetData: { isFirstChange: () => false } as SimpleChange } as SimpleChanges);

            expect(originalChart).toBe(getChart());
        });

        it("should initialize the chart assist with the default palette", () => {
            component.ngOnChanges(initializationChanges);
            expect(component.chartAssist.palette.standardColors.get("testEntityId")).toEqual(defaultPalette().standardColors.get("testEntityId"));
        });

        it("should initialize the chart assist with the configured colors", () => {
            component.configuration = { chartColors: ["blue"] } as ITimeseriesWidgetConfig;
            component.ngOnChanges(initializationChanges);
            expect(component.chartAssist.palette.standardColors.get("testEntityId")).toEqual("blue");
        });

        it("should not add the zoom plugin if zoom is disabled", () => {
            component.configuration = { enableZoom: false } as ITimeseriesWidgetConfig;
            component.ngOnChanges(initializationChanges);
            expect(getChart().hasPlugin(ZoomPlugin)).toEqual(false);
        });

        it("should add the zoom plugin if zoom is enabled", () => {
            component.configuration = { enableZoom: true } as ITimeseriesWidgetConfig;
            component.ngOnChanges(initializationChanges);
            expect(getChart().hasPlugin(ZoomPlugin)).toEqual(true);
        });

        it("should subscribe to the SET_DOMAIN event", () => {
            const timeframe: ISerializableTimeframe = {
                startDatetime: "2019-11-11T18:09:03-06:00",
                endDatetime: "2019-11-18T18:09:03-06:00",
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
            };
            component.ngOnChanges(initializationChanges);
            const spy = spyOn(eventBus.getStream(SET_TIMEFRAME), "next");
            getChart().getEventBus().getStream(SET_DOMAIN_EVENT).next({
                data: {
                    "myScaleId": [
                        timeframe.startDatetime,
                        timeframe.endDatetime,
                    ],
                },
            });
            expect(spy).toHaveBeenCalledWith({ payload: timeframe });
        });

        it("should return true if the series is set to interactive", () => {
            component.configuration = { interaction: "series" } as ITimeseriesWidgetConfig;
            component.ngOnChanges(initializationChanges);
            expect(component.isSeriesInteractive(component.chartAssist.legendSeriesSet[0])).toBe(true);
        });

        it("should return true if the dataSeries has 'link' populated", () => {
            component.widgetData = { series: [{} as ITimeseriesWidgetData] };
            component.widgetData.series[0] = {
                id: "id",
                name: "name",
                description: "description",
                link: "www.link.com",
                data: {} as ITimeseriesWidgetSeriesData[],
            }
            component.ngOnChanges(initializationChanges);
            expect(component.isSeriesInteractive(component.chartAssist.legendSeriesSet[0])).toBe(true);
        });

        it("should return true if the dataSeries has 'secondaryLink' populated", () => {
            component.widgetData = { series: [{} as ITimeseriesWidgetData] };
            component.widgetData.series[0] = {
                id: "id",
                name: "name",
                description: "description",
                secondaryLink: "www.link.com",
                data: {} as ITimeseriesWidgetSeriesData[],
            }
            component.ngOnChanges(initializationChanges);
            expect(component.isSeriesInteractive(component.chartAssist.legendSeriesSet[0])).toBe(true);
        });

        it("should communicate interaction on the EventBus when series is interactive", () => {
            const spy = spyOn(eventBus.getStream(INTERACTION), "next").and.callThrough();
            component.configuration = { interaction: "series" } as ITimeseriesWidgetConfig;
            component.ngOnChanges(initializationChanges);
            component.onPrimaryDescClick(component.chartAssist.legendSeriesSet[0]);
            const interactionData = {
                payload: { data: component.chartAssist.legendSeriesSet[0], interactionType: TimeseriesInteractionType.Series },
                id: "INTERACTION",
            };
            expect(spy).toHaveBeenCalledWith(interactionData);
        });

        it("should return false when no link property is set on the dataSource and the series is not interactive", () => {
            component.widgetData = { series: [{} as ITimeseriesWidgetData] };
            component.widgetData.series[0] = {
                id: "id",
                name: "name",
                description: "description",
                data: {} as ITimeseriesWidgetSeriesData[],
            }
            component.ngOnChanges(initializationChanges);
            expect(component.isSeriesInteractive(component.chartAssist.legendSeriesSet[0])).toBe(false);
        });
    });
});
