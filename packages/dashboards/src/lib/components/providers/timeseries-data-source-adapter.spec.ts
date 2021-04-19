import { EventBus, IDataSource, IEvent, IFilteringOutputs, IFilteringParticipants } from "@nova-ui/bits";
import { Subject } from "rxjs";

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

    public registerComponent(components: Partial<IFilteringParticipants>): void { }

    public deregisterComponent(componentKey: string) { }

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
        pizzagnaService = new PizzagnaService(eventBus, dynamicComponentCreator);
        adapter = new TimeseriesDataSourceAdapter(eventBus, dataSource, pizzagnaService);
    });

    it("should invoke dataSource.applyFilters on eventBus REFRESH", () => {
        const spy = spyOn(dataSource, "applyFilters");
        eventBus.getStream(REFRESH).next();
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
                    data: [1],
                },
            ],
        };

        adapter.updateConfiguration({ series: [{ id: "sourceId", label: "adapterLabel", selectedSeriesId: "sourceId"}] });

        dataSource.outputsSubject.next(testFilteringOutput);
        expect(spy).toHaveBeenCalledWith({
            pizzagnaKey: PizzagnaLayer.Data,
            componentId: undefined,
            propertyPath: [undefined],
        } as never, testAdapterOutput);
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
            expect(spy).toHaveBeenCalledWith({
                pizzagnaKey: PizzagnaLayer.Data,
                componentId: testProperties.componentId,
                propertyPath: [testProperties.propertyPath],
            }, testFilteringOutput);
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
