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

import { SorterDirection } from "../lib/public-api";
import { DataFilterService } from "./data-filter.service";
import {
    IFilter,
    IFilterPub,
    IFilters,
    IRange,
    ISorterFilter,
} from "./data-source/public-api";

interface IStubFilters extends IFilters {
    search?: IFilter<string>;
    paginator?: IFilter<IRange<number>>;
    sorter?: IFilter<ISorterFilter>;
}

class SearchStub implements IFilterPub {
    public getFilters(): IFilter<string> {
        return {
            type: "string",
            value: "searchValue",
        };
    }
}

class PaginatorStub implements IFilterPub {
    public getFilters(): IFilter<IRange<number>> {
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
    public getFilters(): IFilter<ISorterFilter> {
        return {
            type: "sorter",
            value: {
                sortBy: "title",
                direction: SorterDirection.ascending,
            },
        };
    }
}

class DataFilterServiceSearchClassStub extends DataFilterService {
    protected _filters = {
        search: {
            componentInstance: new SearchStub(),
        },
    };
}

class DataFilterServicePaginatorClassStub extends DataFilterService {
    protected _filters = {
        paginator: {
            componentInstance: new PaginatorStub(),
        },
    };
}

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

const expectedFiltersAfterUnregistering: IStubFilters = {
    search: {
        type: "string",
        value: "searchValue",
    },
};

describe("DataFilterService >", () => {
    let service: DataFilterService;

    describe("without parent >", () => {
        it("should correctly register and get filters", () => {
            // @ts-ignore: Suppressing error for testing purposes
            service = new DataFilterService(null);
            const filterComponents = {
                sorter: {
                    componentInstance: new SorterStub(),
                },
                search: {
                    componentInstance: new SearchStub(),
                },
                paginator: {
                    componentInstance: new PaginatorStub(),
                },
            };
            service.registerFilter(filterComponents);
            expect(service.getFilters()).toEqual(expectedFilters);
        });

        it("should correctly register, unregister and get filters", () => {
            // @ts-ignore: Suppressing error for testing purposes
            service = new DataFilterService(null);
            const filterComponents = {
                sorter: {
                    componentInstance: new SorterStub(),
                },
                search: {
                    componentInstance: new SearchStub(),
                },
                paginator: {
                    componentInstance: new PaginatorStub(),
                },
            };

            service.registerFilter(filterComponents);
            service.unregisterFilters(["sorter", "paginator"]);
            expect(service.getFilters()).toEqual(
                expectedFiltersAfterUnregistering
            );
        });
    });

    describe("with parent >", () => {
        it("should correctly register and get filters with one parent", () => {
            service = new DataFilterService(
                // @ts-ignore: Suppressing error for testing purposes
                new DataFilterServiceSearchClassStub(null)
            );
            const filterComponents = {
                sorter: {
                    componentInstance: new SorterStub(),
                },
                paginator: {
                    componentInstance: new PaginatorStub(),
                },
            };
            service.registerFilter(filterComponents);
            expect(service.getFilters()).toEqual(expectedFilters);
        });

        it("should correctly register and get filters with multiple parents", () => {
            service = new DataFilterService(
                new DataFilterServiceSearchClassStub(
                    // @ts-ignore: Suppressing error for testing purposes
                    new DataFilterServicePaginatorClassStub(null)
                )
            );
            const filterComponents = {
                sorter: {
                    componentInstance: new SorterStub(),
                },
            };
            service.registerFilter(filterComponents);
            expect(service.getFilters()).toEqual(expectedFilters);
        });
    });
});
