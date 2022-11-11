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

import { Subject } from "rxjs";

import {
    EventBus,
    IDataSource,
    IEvent,
    IFilteringOutputs,
    IFilteringParticipants,
} from "@nova-ui/bits";

import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { REFRESH } from "../../services/types";
import { PizzagnaLayer } from "../../types";
import { TimeseriesDataSourceAdapter } from "./timeseries-data-source-adapter";
import { ITimeseriesDataSourceAdapterConfiguration } from "./types";

class MockDataSource implements IDataSource {
    public outputsSubject = new Subject<IFilteringOutputs>();

    public async applyFilters(): Promise<void> {
        // @ts-ignore: Suppressed for test purposes
        return null;
    }

    public registerComponent(
        components: Partial<IFilteringParticipants>
    ): void {}

    public deregisterComponent(componentKey: string) {}
}

describe("TimeseriesDataSourceAdapter > ", () => {
    let adapter: TimeseriesDataSourceAdapter;
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
        adapter = new TimeseriesDataSourceAdapter(
            eventBus,
            dataSource,
            pizzagnaService
        );
    });

    it("should invoke dataSource.applyFilters on eventBus REFRESH", () => {
        const spy = spyOn(dataSource, "applyFilters");
        eventBus.getStream(REFRESH).next(undefined);
        expect(spy).toHaveBeenCalled();
    });

    it("should invoke pizzagnaService.setProperty on datasource.outputsSubject.next", () => {
        const spy = spyOn(pizzagnaService, "setProperty");
        const testFilteringOutput = {
            series: [
                {
                    id: "sourceId",
                    description: "sourceDescription",
                    data: [1],
                },
            ],
        };

        const testAdapterOutput = {
            series: [
                {
                    id: "sourceId",
                    legendDescriptionPrimary: "adapterLabel",
                    legendDescriptionSecondary: "sourceDescription",
                    link: undefined,
                    secondaryLink: undefined,
                    data: [1],
                },
            ],
        };

        adapter.updateConfiguration({
            series: [
                {
                    id: "sourceId",
                    label: "adapterLabel",
                    selectedSeriesId: "sourceId",
                },
            ],
        });

        dataSource.outputsSubject.next(testFilteringOutput);
        expect(spy).toHaveBeenCalledWith(
            {
                pizzagnaKey: PizzagnaLayer.Data,
                componentId: undefined,
                propertyPath: [undefined],
            } as never,
            testAdapterOutput
        );
    });

    describe("updateConfiguration > ", () => {
        it("should update the componentPath and propertyPath", () => {
            const testProperties: ITimeseriesDataSourceAdapterConfiguration = {
                componentId: "testCompId",
                propertyPath: "testPath",
                series: [],
            };
            adapter.updateConfiguration(testProperties);
            const spy = spyOn(pizzagnaService, "setProperty");
            const testFilteringOutput: IFilteringOutputs = {
                series: [],
            };
            dataSource.outputsSubject.next(testFilteringOutput);
            expect(spy).toHaveBeenCalledWith(
                {
                    pizzagnaKey: PizzagnaLayer.Data,
                    componentId: testProperties.componentId,
                    propertyPath: [testProperties.propertyPath],
                },
                testFilteringOutput
            );
        });
    });

    describe("processOutput", () => {
        it("should return the value null if value is null", () => {
            const value: IFilteringOutputs | undefined = undefined;
            const data = (<any>adapter).processOutput(value);
            expect(data).toEqual(value);
        });
    });
});
