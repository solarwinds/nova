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

import { SimpleChanges } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DataSourceFeatures, EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { DynamicComponentCreator } from "../../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import {
    PIZZAGNA_EVENT_BUS,
    WellKnownDataSourceFeatures,
} from "../../../../../types";
import { DATA_SOURCE_CREATED } from "../../../../types";
import { TableColumnsConfigurationComponent } from "./table-columns-configuration.component";

import Spy = jasmine.Spy;

describe("TableColumnsConfigurationComponent", () => {
    let component: TableColumnsConfigurationComponent;
    let fixture: ComponentFixture<TableColumnsConfigurationComponent>;
    let eventBus: EventBus<any>;

    beforeEach(waitForAsync(() => {
        eventBus = new EventBus<any>();
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                PizzagnaService,
                DynamicComponentCreator,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableColumnsConfigurationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        it("should not throw if a column doesn't have a formatter defined", () => {
            component.columns = [
                {
                    id: "testId",
                    label: "",
                    // @ts-ignore: Suppressed for test purposes
                    formatter: null,
                },
            ];

            const changes: SimpleChanges = {
                dataFields: {
                    previousValue: [
                        {
                            id: "oldId",
                            label: "Old Label",
                            dataType: "string",
                        },
                    ],
                    currentValue: [
                        {
                            id: "newId",
                            label: "New Label",
                            dataType: "string",
                        },
                    ],
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };

            spyOn(component, "onItemsChange");
            expect(() => component.ngOnChanges(changes)).not.toThrow();
        });
    });

    describe("automatic column generation", () => {
        let resetColumnsSpy: Spy;
        let onItemsChangeSpy: Spy;

        beforeEach(() => {
            resetColumnsSpy = spyOn(component, "resetColumns");
            onItemsChangeSpy = spyOn(component, "onItemsChange");
        });

        it("generates columns", () => {
            eventBus.getStream(DATA_SOURCE_CREATED).next({
                payload: {},
            });

            const changes: SimpleChanges = {
                dataFields: {
                    previousValue: undefined,
                    currentValue: [
                        {
                            id: "newId",
                            label: "New Label",
                            dataType: "string",
                        },
                    ],
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };

            component.ngOnChanges(changes);

            expect(resetColumnsSpy).toHaveBeenCalledTimes(1);
            expect(onItemsChangeSpy).not.toHaveBeenCalled();
        });

        it("generates columns when related feature is disabled", () => {
            eventBus.getStream(DATA_SOURCE_CREATED).next({
                payload: {
                    features: new DataSourceFeatures({
                        [WellKnownDataSourceFeatures.DisableTableColumnGeneration]:
                            { enabled: false },
                    }),
                },
            });

            const changes: SimpleChanges = {
                dataFields: {
                    previousValue: undefined,
                    currentValue: [
                        {
                            id: "newId",
                            label: "New Label",
                            dataType: "string",
                        },
                    ],
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };

            component.ngOnChanges(changes);

            expect(resetColumnsSpy).toHaveBeenCalledTimes(1);
            expect(onItemsChangeSpy).not.toHaveBeenCalled();
        });

        it("doesn't generates columns when the data source features disables that", () => {
            eventBus.getStream(DATA_SOURCE_CREATED).next({
                payload: {
                    features: new DataSourceFeatures({
                        [WellKnownDataSourceFeatures.DisableTableColumnGeneration]:
                            { enabled: true },
                    }),
                },
            });

            const changes: SimpleChanges = {
                dataFields: {
                    previousValue: undefined,
                    currentValue: [
                        {
                            id: "newId",
                            label: "New Label",
                            dataType: "string",
                        },
                    ],
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };

            component.ngOnChanges(changes);

            expect(resetColumnsSpy).not.toHaveBeenCalled();
            expect(onItemsChangeSpy).toHaveBeenCalled();
        });
    });
});
