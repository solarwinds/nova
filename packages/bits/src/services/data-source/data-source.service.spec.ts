import { nameof } from "../../functions/nameof";
import { SorterDirection } from "../../lib/public-api";

import { DataSourceService } from "./data-source.service";
import { IFilter, IFilteringOutputs, IFilterPub, IFilters, IRange, ISorterFilter, Paginator, Repeat } from "./public-api";

const expectedFilteringOutputs: IStubFilteringOutputs = {
    repeat: {
        itemsSource: [1, 2, 3, 4, 5],
    },
    paginator: {
        total: 15,
        reset: false,
    },
};

const expectedFilters: IStubFilters = {
    search: {
        type: "string",
        value: "searchValue",
    },
    paginator: {
        type: "range",
        value: {
            start: 0,
            end: 5,
        },
    },
    sorter: {
        type: "sorter",
        value: {
            sortBy: "title",
            direction: SorterDirection.ascending,
        },
    },
};

const testedFilterName = nameof<IStubFilters>("search");

interface IStubFilters extends IFilters {
    search?: IFilter<string>;
    paginator?: IFilter<IRange<number>>;
    sorter?: IFilter<ISorterFilter>;
}

interface IStubFilteringOutputs extends IFilteringOutputs {
    repeat?: Repeat;
    paginator?: Paginator;
}

class SearchStub implements IFilterPub {
    getFilters(): IFilter<string> {
        return {
            type: "string",
            value: "searchValue",
        };
    }
}

class PaginatorStub implements IFilterPub {
    getFilters(): IFilter<IRange<number>> {
        return {
            type: "range",
            value: {
                start: 0,
                end: 5,
            },
        };
    }
}

class SorterStub implements IFilterPub {
    getFilters(): IFilter<ISorterFilter> {
        return {
            type: "sorter",
            value: {
                sortBy: "title",
                direction: SorterDirection.ascending,
            },
        };
    }
}

const expectedComponentTreeStructure = {
    search: { componentInstance: new SearchStub() },
    paginator: { componentInstance: new PaginatorStub() },
    sorter: { componentInstance: new SorterStub() },
};

class DataSourceServiceSubClassStub<T> extends DataSourceService<T> {
    public get rememberedComponentTree() {
        return this._components;
    }
    public async getFilteredData(filters: IStubFilters): Promise<IStubFilteringOutputs> {
        return Promise.resolve(expectedFilteringOutputs);
    }
}

describe("DataSourceService >", () => {
    let service: DataSourceServiceSubClassStub<IStubFilteringOutputs>;
    beforeEach(() => {
        service = new DataSourceServiceSubClassStub<IStubFilteringOutputs>();
        service.componentTree = expectedComponentTreeStructure;
    });

    it("should remember correctly componentTree", () => {
        expect(service.rememberedComponentTree).toBe(expectedComponentTreeStructure);
    });

    it("should retrieve an individual filter by name", () => {
        const filter = service.getFilter(testedFilterName);
        expect(filter).toEqual(expectedFilters[testedFilterName]);
    });

    it("should throw an error when trying to retrieve an invalid filter name", () => {
        const filterName = "invalidFilterName";
        expect(() => service.getFilter(filterName)).toThrowError(new RegExp("Invalid filter name(.*)"));
    });

    it("should retrieve all current filters", () => {
        const currentFilters = service.getFilters();
        expect(currentFilters).toEqual(expectedFilters);
    });

    it("should call getFilteredData with correct filters value", () => {
        const spyFunc = spyOn(service, "getFilteredData");
        service.applyFilters();
        expect(spyFunc).toHaveBeenCalledWith(expectedFilters);
    });

    it("should detect a filter changed from the previous run when applying filters", async() => {
        let filters: IFilter<string>;

        const initialValue = "searchValue";
        const changedValue = "searchValueChanged";

        // 1st call made in order to set previous filters
        await service.applyFilters();

        filters = { type: "string", value: initialValue };
        expect(service.filterChanged(testedFilterName, filters)).toBeFalsy();

        // 2nd call
        filters = { type: "string", value: changedValue };
        expect(service.filterChanged(testedFilterName, filters)).toBeTruthy();

        expect(service.filtersChanged({[testedFilterName]: filters}, testedFilterName)).toBeTruthy();
    });

    it("should return correct value when call applyFilters ", async () => {
        let result: IStubFilteringOutputs;
        await service.applyFilters();
        service.outputsSubject.subscribe((data: IStubFilteringOutputs) => {
            result = data;
            expect(result).toBe(expectedFilteringOutputs);
        });
    });

});
