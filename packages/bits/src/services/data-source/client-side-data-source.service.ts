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

import { Injectable } from "@angular/core";
import _forEach from "lodash/forEach";
import _get from "lodash/get";
import _orderBy from "lodash/orderBy";

import { DataSourceService } from "./data-source.service";
import {
    IFilter,
    IFilterGroup,
    IMultiFilterMetadata,
    INovaFilteringOutputs,
    INovaFilters,
} from "./public-api";
import { SorterDirection } from "../../lib/sorter/public-api";
import { SearchService } from "../search.service";

/**
 * <example-url>./../examples/index.html#/common/data-source-service/client-side</example-url>
 */
@Injectable()
export class ClientSideDataSource<
    T,
    F extends INovaFilters = INovaFilters
> extends DataSourceService<T, F> {
    protected _allData: T[];
    protected _searchProps: string[] = [];

    // cache used to store our previous fetched results while scrolling
    // and more data is automatically fetched from the backend
    protected virtualScrollData: T[] = [];

    constructor(protected searchService: SearchService) {
        super();
    }

    public setData(initialData: T[] = []): void {
        this._allData = initialData;
    }

    public setSearchProperties(properties: string[]): void {
        this._searchProps = properties;
    }

    public async getFilteredData(filters: F): Promise<INovaFilteringOutputs> {
        let nextChunk: T[] = this.prepareData(filters);

        // APPLY SEARCH USING CHECKBOX VALUES
        const searchTerm: string | undefined = filters?.search?.value;
        // APPLY SEARCH
        if (searchTerm) {
            nextChunk = this.searchHandler(searchTerm);
        }

        const numberOfItems = nextChunk.length;

        if (this.shouldResetFilters(filters) && filters?.virtualScroll) {
            // reset virtual scroll items
            this.virtualScrollData = [];
        }

        nextChunk = <T[]>this.sortingHandler(filters, nextChunk);
        nextChunk = this.paginationHandler(filters, nextChunk);
        nextChunk = this.virtualScrollHandler(filters, nextChunk);

        return {
            repeat: {
                itemsSource: nextChunk,
            },
            paginator: {
                total: numberOfItems,
            },
        };
    }

    protected prepareData(filters: F): T[] {
        return this._allData;
    }

    protected searchHandler(searchTerm: any): T[] {
        return this.searchService.search(
            this._allData,
            this._searchProps,
            searchTerm
        );
    }

    protected sortingHandler(filters: any, nextChunk: T[]): T[] {
        if (
            _get(filters, "sorter.value.sortBy") &&
            _get(filters, "sorter.value.direction")
        ) {
            // Original direction means that sorting is not needed
            if (filters.sorter.value.direction !== SorterDirection.original) {
                return _orderBy(
                    nextChunk,
                    filters.sorter.value.sortBy,
                    filters.sorter.value.direction
                );
            }
        }
        return nextChunk;
    }

    protected paginationHandler(filters: any, nextChunk: T[]): T[] {
        if (filters?.paginator) {
            return nextChunk.slice(
                filters.paginator.value.start,
                filters.paginator.value.end
            );
        }
        return nextChunk;
    }

    protected virtualScrollHandler(filters: any, nextChunk: T[]): T[] {
        let data = nextChunk;
        if (filters?.virtualScroll) {
            data = nextChunk.slice(
                filters.virtualScroll.value.start,
                filters.virtualScroll.value.end
            );

            // for virtual scroll we must always append current chunk to the previous ones
            data = this.virtualScrollData = this.virtualScrollData.concat(data);
        }

        return data;
    }

    protected extractMultiFilters(
        filters: F
    ): IFilterGroup<IFilter<string[], IMultiFilterMetadata>>[] {
        const multiFilterArr: IFilterGroup<
            IFilter<string[], IMultiFilterMetadata>
        >[] = [];
        _forEach(filters, (value, key) => {
            if (value?.type === "string[]") {
                multiFilterArr.push({ [key]: value } as any);
            }
        });
        return multiFilterArr;
    }
}
