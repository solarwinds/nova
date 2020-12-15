import { SimpleChange, SimpleChanges } from "@angular/core";
import { async, ComponentFixture, fakeAsync, flush, TestBed } from "@angular/core/testing";
import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { DynamicComponentCreator } from "../../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS } from "../../../../../types";

import { TimeseriesSeriesCollectionConfigurationComponent } from "./timeseries-series-collection-configuration.component";

describe("TimeseriesSeriesCollectionConfigurationComponent", () => {
    let component: TimeseriesSeriesCollectionConfigurationComponent;
    let fixture: ComponentFixture<TimeseriesSeriesCollectionConfigurationComponent>;
    const eventBus = new EventBus();
    const dynamicComponentCreator = new DynamicComponentCreator();
    // @ts-ignore: Suppressed for test purposes
    const pizzagnaService = new PizzagnaService(eventBus, dynamicComponentCreator);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                {
                    provide: DynamicComponentCreator,
                    useValue: dynamicComponentCreator,
                },
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
                {
                    provide: PizzagnaService,
                    useValue: pizzagnaService,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TimeseriesSeriesCollectionConfigurationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        it("should invoke 'PizzagnaService.createComponentsFromTemplate' if 'allSeries' has changed and it's not the first change", () => {
            component.series = [{
                id: "testConfigId",
                selectedSeriesId: "testSeriesId",
            }];
            const changes: SimpleChanges = {
                allSeries: { isFirstChange: () => false } as SimpleChange,
            };

            const spy = spyOn(pizzagnaService, "createComponentsFromTemplate");
            component.ngOnChanges(changes);

            expect(spy).toHaveBeenCalledWith("series", component.series.map(config => config.id));
        });

        it("should not invoke 'PizzagnaService.createComponentsFromTemplate' if 'allSeries' hasn't changed", () => {
            const changes: SimpleChanges = {
                series: { isFirstChange: () => false } as SimpleChange,
            };

            const spy = spyOn(pizzagnaService, "createComponentsFromTemplate");
            component.ngOnChanges(changes);

            expect(spy).not.toHaveBeenCalled();
        });

        it("should invoke 'ChangeDetectorRef.markForCheck' if 'allSeries' has changed and it's not the first change", fakeAsync(() => {
            spyOn(dynamicComponentCreator, "getPizzagnaUpdatedWithComponents");

            const changes: SimpleChanges = {
                allSeries: { isFirstChange: () => false } as SimpleChange,
            };

            const spy = spyOn(component.changeDetector, "markForCheck");
            component.ngOnChanges(changes);

            flush();

            expect(spy).toHaveBeenCalled();
        }));
    });

});
