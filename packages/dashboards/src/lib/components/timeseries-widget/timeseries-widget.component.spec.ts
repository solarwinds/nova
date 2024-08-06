import { TimeseriesWidgetComponent } from "@nova-ui/dashboards";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe(TimeseriesWidgetComponent.name, () => {
    let component: TimeseriesWidgetComponent;
    let fixture: ComponentFixture<TimeseriesWidgetComponent>;

    beforeEach(() => {
        fixture = TestBed.createComponent(TimeseriesWidgetComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("shouldShowChart", () => {
        it("should return false when widgetData is null", () => {
            // @ts-ignore: TypeScript error ignored for testing purposes
            component.widgetData = null;
            expect(component.shouldShowChart()).toBeFalse();
        });

        it("should return false when widgetData is undefined", () => {
            // @ts-ignore: TypeScript error ignored for testing purposes
            component.widgetData = undefined;
            expect(component.shouldShowChart()).toBeFalse();
        });

        it("should return false when widgetData contains series array with 0 series objects", () => {
            component.widgetData = {
                series: [],
            };
            expect(component.shouldShowChart()).toBeFalse();
        });

        it("should return true when widgetData contains series array with 1 series object", () => {
            component.widgetData = {
                series: [
                    {
                        id: "series-1",
                        name: "Series 1",
                        data: [],
                        link: "",
                        description: "",
                        metricUnits: undefined,
                        rawData: undefined,
                        secondaryLink: undefined,
                        transformer: undefined,
                    },
                ],
            };
            expect(component.shouldShowChart()).toBeTrue();
        });

        it("should return true when widgetData contains multiple series objects", () => {
            component.widgetData = {
                series: [
                    {
                        id: "series-1",
                        name: "Series 1",
                        data: [],
                        link: "",
                        description: "",
                        metricUnits: undefined,
                        rawData: undefined,
                        secondaryLink: undefined,
                        transformer: undefined,
                    },
                    {
                        id: "series-2",
                        name: "Series 2",
                        data: [],
                        link: "",
                        description: "",
                        metricUnits: undefined,
                        rawData: undefined,
                        secondaryLink: undefined,
                        transformer: undefined,
                    },
                ],
            };
            expect(component.shouldShowChart()).toBeTrue();
        });
    });

    describe("toggleLeave", () => {
        it("should set allowPopover to false", () => {
            component.toggleLeave();
            expect(component.allowPopover).toBeFalse();
        });
    });

    describe("toggleEnter", () => {
        it("should set allowPopover to true", () => {
            component.toggleEnter();
            expect(component.allowPopover).toBeTrue();
        });
    });
});
