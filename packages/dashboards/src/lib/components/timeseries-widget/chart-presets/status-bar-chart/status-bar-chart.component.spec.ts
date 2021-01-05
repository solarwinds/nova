import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EventBus, IconService, IEvent } from "@nova-ui/bits";
import { Chart, SET_DOMAIN_EVENT, ZoomPlugin } from "@nova-ui/charts";
import moment from "moment/moment";

import { SET_TIMEFRAME } from "../../../../services/types";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../types";
import { TimeseriesScalesService } from "../../timeseries-scales.service";

import { StatusBarChartComponent } from "./status-bar-chart.component";

describe("StatusChartComponent", () => {
    const frozenTime = moment("2020-11-06T00:00:00-06:00").startOf("day").toDate();
    let component: StatusBarChartComponent;
    let fixture: ComponentFixture<StatusBarChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                IconService,
                TimeseriesScalesService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: new EventBus<IEvent>(),
                },
                {
                    provide: DATA_SOURCE,
                    useValue: {},
                },
            ],
            declarations: [StatusBarChartComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatusBarChartComponent);
        component = fixture.componentInstance;
        component.widgetData = {
            series: [
                {
                    id: "series-1",
                    name: "Test Name",
                    description: "Test Description",
                    data: [
                        { x: moment(frozenTime).subtract(9, "day").toDate(), y: Status.Warning },
                        { x: moment(frozenTime).subtract(6, "day").toDate(), y: Status.Up },
                        { x: moment(frozenTime).subtract(3, "day").toDate(), y: Status.Critical },
                        { x: moment(frozenTime).toDate(), y: Status.Critical },
                    ],
                },
                {
                    id: "series-2",
                    name: "Test Name",
                    description: "Test Description",
                    data: [
                        { x: moment(frozenTime).subtract(9, "day").toDate(), y: Status.Critical },
                        { x: moment(frozenTime).subtract(6, "day").toDate(), y: Status.Warning },
                        { x: moment(frozenTime).subtract(3, "day").toDate(), y: Status.Up },
                        { x: moment(frozenTime).toDate(), y: Status.Up },
                    ],
                },
            ],
        };
        (<any>component).buildChart();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("updateChartData", () => {
        it("should add the zoom plugin to each spark if zoom is enabled", () => {
            component.configuration.enableZoom = true;
            (<any>component).updateChartData();
            component.chartAssist.sparks.forEach(spark => {
                expect((spark?.chart as Chart)?.hasPlugin(ZoomPlugin)).toEqual(true);
            });
        });

        it("should not add multiple zoom plugins on multiple calls", () => {
            component.configuration.enableZoom = true;

            // multiple calls
            (<any>component).updateChartData();
            (<any>component).updateChartData();

            spyOn(ZoomPlugin.prototype, "destroy");
            component.chartAssist.sparks.forEach(spark => {
                expect((spark?.chart as Chart)?.hasPlugin(ZoomPlugin)).toEqual(true);
                (spark?.chart as Chart)?.removePlugin(ZoomPlugin);
                expect((spark?.chart as Chart)?.hasPlugin(ZoomPlugin)).toEqual(false);
            });
        });

        it("should not add the zoom plugin to each spark if zoom is disabled", () => {
            component.configuration.enableZoom = false;
            (<any>component).updateChartData();
            component.chartAssist.sparks.forEach(spark => {
                expect((spark?.chart as Chart)?.hasPlugin(ZoomPlugin)).toEqual(false);
            });
        });

        it("should subscribe to only the first spark's SET_DOMAIN_EVENT", () => {
            component.configuration.enableZoom = true;
            const expectedDomain = [5, 10];
            (<any>component).updateChartData();
            const spy = spyOn((<any>component).eventBus.getStream(SET_TIMEFRAME), "next");
            component.chartAssist.sparks.forEach(spark => {
                spark.chart?.getEventBus().getStream(SET_DOMAIN_EVENT).next({ data: { x: expectedDomain } });
            });
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({
                payload: {
                    startDatetime: expectedDomain[0],
                    endDatetime: expectedDomain[1],
                    selectedPresetId: null,
                },
            });
        });

        it("should maintain only one subscription to the SET_DOMAIN_EVENT on multiple calls", () => {
            component.configuration.enableZoom = true;
            const expectedDomain = [5, 10];

            // multiple calls
            (<any>component).updateChartData();
            (<any>component).updateChartData();

            const spy = spyOn((<any>component).eventBus.getStream(SET_TIMEFRAME), "next");
            component.chartAssist.sparks.forEach(spark => {
                spark.chart?.getEventBus().getStream(SET_DOMAIN_EVENT).next({ data: { x: expectedDomain } });
            });
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({
                payload: {
                    startDatetime: expectedDomain[0],
                    endDatetime: expectedDomain[1],
                    selectedPresetId: null,
                },
            });
        });
    });

    describe("transformData", () => {
        it("should set end to the next value in the progression if the progression is not on an interval", () => {
            const result = (<any>component).transformData(component.widgetData.series[0].data, false);
            expect(result[0].end).toEqual(result[1].start);
        });

        it("should use the same value for start and end if the progression is on an interval", () => {
            const result = (<any>component).transformData(component.widgetData.series[0].data, true);
            expect(result[0].start).toEqual(result[0].end);
        });
    });

});

enum Status {
    Up = "up",
    Warning = "warning",
    Critical = "critical",
}
