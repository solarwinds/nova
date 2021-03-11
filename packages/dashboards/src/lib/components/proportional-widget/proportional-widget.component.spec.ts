import { NgZone, SimpleChange, SimpleChanges } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EventBus, IDataSource, IEvent, IFilteringOutputs, IFilteringParticipants } from "@nova-ui/bits";
import { defaultPalette } from "@nova-ui/charts";
import { Subject } from "rxjs";

import { NuiDashboardsModule } from "../../dashboards.module";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { ProviderRegistryService } from "../../services/provider-registry.service";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../types";

import { ProportionalWidgetComponent } from "./proportional-widget.component";
import { IProportionalWidgetConfig } from "./types";

class MockDataSource implements IDataSource {
    public outputsSubject = new Subject<IFilteringOutputs>();
    public filterParticipants: IFilteringParticipants;

    public async applyFilters(): Promise<void> {
        // @ts-ignore: Suppressed for testing purposes
        return null;
    }

    public registerComponent(components: Partial<IFilteringParticipants>): void {
        // @ts-ignore: Suppressed for testing purposes
        this.filterParticipants = components;
    }

    public deregisterComponent(componentKey: string) {
        delete this.filterParticipants?.[componentKey];
    }
}

describe("ProportionalWidgetComponent", () => {
    let component: ProportionalWidgetComponent;
    let fixture: ComponentFixture<ProportionalWidgetComponent>;
    const eventBus = new EventBus<IEvent>();
    const dynamicComponentCreator = new DynamicComponentCreator();
    const pizzagnaService = new PizzagnaService(eventBus, dynamicComponentCreator);
    const dataSource = new MockDataSource();
    let ngZone: NgZone;

    beforeAll(() => {
        ngZone = TestBed.inject(NgZone);
        spyOn(ngZone, "runOutsideAngular").and.callFake((fn: Function) => fn());
    });

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
                {
                    provide: DATA_SOURCE,
                    useValue: dataSource,
                },
                {
                    provide: PizzagnaService,
                    useValue: pizzagnaService,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProportionalWidgetComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        let changes: SimpleChanges;
        let buildChartSpy: jasmine.Spy;

        beforeEach(() => {
            buildChartSpy = spyOn(<any>component, "buildChart");
            component.configuration = { chartOptions: {}, chartColors: {} } as IProportionalWidgetConfig;
            changes = {
                configuration: { currentValue: { chartOptions: {} }, previousValue: { chartOptions: {} } } as SimpleChange,
            };
        });

        it("should update the color provider if colors are specified in the configuration", () => {
            component.configuration.chartColors = ["blue"];
            changes.configuration.currentValue.chartColors = ["blue"];
            component.ngOnChanges(changes);
            expect((<any>component).chartPalette.standardColors.get("testEntityId")).toEqual("blue");
        });

        it("should rebuild the chart if the color configuration changes", () => {
            changes.configuration.currentValue.chartColors = ["blue"];
            component.ngOnChanges(changes);
            expect(buildChartSpy).toHaveBeenCalled();
        });

        it("should use the default color provider if no colors are specified in the configuration", () => {
            changes.configuration.currentValue.chartColors = undefined;
            component.ngOnChanges(changes);
            expect((<any>component).chartPalette.standardColors.get("testEntityId")).toEqual(defaultPalette().standardColors.get("testEntityId"));
        });

        it("should not rebuild the chart if the color configuration doesn't change", () => {
            changes.configuration.previousValue.chartColors = ["blue"];
            changes.configuration.currentValue.chartColors = ["blue"];
            component.ngOnChanges(changes);
            expect(buildChartSpy).not.toHaveBeenCalled();
        });

    });

});
