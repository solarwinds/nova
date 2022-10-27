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

import { fakeAsync, flush } from "@angular/core/testing";
import { Subject } from "rxjs";

import {
    EventBus,
    IDataSource,
    IEvent,
    IFilteringOutputs,
    IFilteringParticipants,
} from "@nova-ui/bits";

import { DATA_SOURCE_OUTPUT } from "../../configurator/types";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { REFRESH } from "../../services/types";
import { IConfigurable, IProperties, PizzagnaLayer } from "../../types";
import { DataSourceAdapter } from "./data-source-adapter";
import { IDataSourceOutput } from "./types";

class MockDataSource implements IDataSource, IConfigurable {
    public outputsSubject = new Subject<
        IDataSourceOutput<IFilteringOutputs> | IFilteringOutputs
    >();

    public async applyFilters(): Promise<void> {
        // @ts-ignore: Suppressed for testing purposes
        return null;
    }

    public registerComponent(
        components: Partial<IFilteringParticipants>
    ): void {}

    public deregisterComponent(componentKey: string) {}

    public updateConfiguration(properties: IProperties): void {}
}

describe("DataSourceAdapter > ", () => {
    let adapter: DataSourceAdapter;
    let dataSource: MockDataSource;
    let eventBus: EventBus<IEvent>;
    let pizzagnaService: PizzagnaService;
    let dynamicComponentCreator: DynamicComponentCreator;

    beforeEach(() => {
        eventBus = new EventBus();
        dataSource = new MockDataSource();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(
            eventBus,
            dynamicComponentCreator
        );
        adapter = new DataSourceAdapter(eventBus, dataSource, pizzagnaService);
        (<any>adapter).componentId = "testId";
    });

    it("should invoke dataSource.applyFilters on eventBus REFRESH", () => {
        const spy = spyOn(dataSource, "applyFilters");
        eventBus.getStream(REFRESH).next();
        expect(spy).toHaveBeenCalled();
    });

    it("should invoke pizzagnaService.setProperty on dataSource.outputsSubject.next", () => {
        const spy = spyOn(pizzagnaService, "setProperty");

        // dsOutput doesn't have a 'result' property in this case (we accommodate both scenarios for backward compatibility)
        const dsOutput = { test: {} };

        dataSource.outputsSubject.next(dsOutput);
        expect(spy).toHaveBeenCalledWith(
            {
                pizzagnaKey: PizzagnaLayer.Data,
                componentId: (<any>adapter).componentId,
                propertyPath: [undefined] as never,
            },
            dsOutput
        );
    });

    it("should invoke pizzagnaService.setProperty on dataSource.outputsSubject.next with the event.result value if it exists", () => {
        const spy = spyOn(pizzagnaService, "setProperty");
        const testFilteringOutput = { test: {} };

        // dsOutput has a 'result' property in this case (we accommodate both scenarios for backward compatibility)
        const dsOutput = { result: testFilteringOutput };

        dataSource.outputsSubject.next(dsOutput);
        expect(spy).toHaveBeenCalledWith(
            {
                pizzagnaKey: PizzagnaLayer.Data,
                componentId: (<any>adapter).componentId,
                propertyPath: [undefined] as never,
            },
            testFilteringOutput
        );
    });

    describe("updateConfiguration > ", () => {
        it("should update the componentPath and propertyPath", () => {
            const testProperties: IProperties = {
                componentId: "testId",
                propertyPath: "testPath",
            };
            adapter.updateConfiguration(testProperties);
            const spy = spyOn(pizzagnaService, "setProperty");
            const testFilteringOutput = { test: {} };
            const dsOutput = { result: testFilteringOutput };
            dataSource.outputsSubject.next(dsOutput);
            expect(spy).toHaveBeenCalledWith(
                {
                    pizzagnaKey: PizzagnaLayer.Data,
                    componentId: testProperties.componentId,
                    propertyPath: [testProperties.propertyPath],
                },
                testFilteringOutput
            );
        });

        it("should update the dataSourceConfiguration if there's a change in the data source properties", () => {
            const testDSProperties = {
                testProp: "testValue",
            };
            const testProperties: IProperties = {
                dataSource: {
                    properties: testDSProperties,
                },
            };
            adapter.updateConfiguration(testProperties);
            expect((<any>adapter).dataSourceConfiguration).toEqual(
                testDSProperties
            );
        });

        it("should invoke updateConfiguration on the data source if there's a change in the data source properties", () => {
            const testDSProperties = {
                testProp: "testValue",
            };
            const testProperties: IProperties = {
                dataSource: {
                    properties: testDSProperties,
                },
            };
            const spy = spyOn(
                adapter.dataSource as unknown as IConfigurable,
                "updateConfiguration"
            );
            adapter.updateConfiguration(testProperties);
            expect(spy).toHaveBeenCalledWith(testDSProperties);
        });

        it("should emit a REFRESH on the pizzagna event bus if there's a change in the data source properties", () => {
            const testDSProperties = {
                testProp: "testValue",
            };
            const testProperties: IProperties = {
                dataSource: {
                    properties: testDSProperties,
                },
            };
            const spy = spyOn(adapter.eventBus.getStream(REFRESH), "next");
            adapter.updateConfiguration(testProperties);
            expect(spy).toHaveBeenCalled();
        });

        it("should emit a REFRESH on the pizzagna event bus if the data source properties is undefined", fakeAsync(() => {
            const testProperties: IProperties = {};
            const spy = spyOn(adapter.eventBus.getStream(REFRESH), "next");
            adapter.updateConfiguration(testProperties);
            expect(spy).not.toHaveBeenCalled();
            flush();
            expect(spy).toHaveBeenCalled();
        }));

        it("should emit a DATA_SOURCE_OUTPUT on the pizzagna event bus if there's a change in the data source properties", () => {
            const testFilteringOutput = { result: { test: {} } };
            const spy = spyOn(
                adapter.eventBus.getStream(DATA_SOURCE_OUTPUT),
                "next"
            );
            dataSource.outputsSubject.next(testFilteringOutput);
            expect(spy).toHaveBeenCalledWith({
                payload: {
                    componentId: (<any>adapter).componentId,
                    ...testFilteringOutput,
                },
            });
        });
    });
});
