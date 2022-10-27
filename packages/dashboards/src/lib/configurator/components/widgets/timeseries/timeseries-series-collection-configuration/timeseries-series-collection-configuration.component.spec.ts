// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { SimpleChange, SimpleChanges } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    waitForAsync,
} from "@angular/core/testing";

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
    const pizzagnaService = new PizzagnaService(
        // @ts-ignore: Suppressed for test purposes
        eventBus,
        dynamicComponentCreator
    );

    beforeEach(waitForAsync(() => {
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
        fixture = TestBed.createComponent(
            TimeseriesSeriesCollectionConfigurationComponent
        );
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        it("should invoke 'PizzagnaService.createComponentsFromTemplate' if 'allSeries' has changed and it's not the first change", () => {
            component.series = [
                {
                    id: "testConfigId",
                    selectedSeriesId: "testSeriesId",
                },
            ];
            const changes: SimpleChanges = {
                allSeries: { isFirstChange: () => false } as SimpleChange,
            };

            const spy = spyOn(pizzagnaService, "createComponentsFromTemplate");
            component.ngOnChanges(changes);

            expect(spy).toHaveBeenCalledWith(
                "series",
                component.series.map((config) => config.id)
            );
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
