import { Injectable } from "@angular/core";
import _forEach from "lodash/forEach";
import _get from "lodash/get";
import _intersection from "lodash/intersection";
import _isEqual from "lodash/isEqual";
import _orderBy from "lodash/orderBy";

import { SorterDirection } from "../../lib/sorter/public-api";
import { SearchService } from "../search.service";

import {
    DataSourceService,
} from "./data-source.service";
import {
    IFilter,
    IFilterGroup,
    IFilteringOutputs,
    IFilterItem,
    IMultiFilterMetadata,
    INovaFilteringOutputs,
    INovaFilters
} from "./public-api";

/** @ignore */
interface ComparisonItems {
    previousValue: any;
    currentValue: any;
}

/**
 * TODO: remove in v12
 * <example-url>./../examples/index.html#/common/data-source-service/deprecated-client-side</example-url>
 * @deprecated
 */
@Injectable()
export class LocalFilteringDataSource<T, F extends INovaFilters = INovaFilters> extends DataSourceService<T, F> {
    protected _allData: T[];
    protected _allCategoriesResult: IFilteringOutputs = {};
    protected _searchProps: string[] = [];

    // cache used to store our previous fetched results while scrolling
    // and more data is automatically fetched from the backend
    protected virtualScrollData: T[] = [];

    constructor(protected searchService: SearchService) {
        super();
    }

    public setData(initialData: T[] = []) {
        this._allData = initialData;
    }

    public setSearchProperties(properties: string[]) {
        this._searchProps = properties;
    }

    public async getFilteredData(filters: F): Promise<INovaFilteringOutputs> {
        let nextChunk: T[] = this.prepareData();

        // APPLY SEARCH USING CHECKBOX VALUES
        const searchTerm: string | undefined = filters?.search?.value;
        // APPLY SEARCH
        if (searchTerm) {
            nextChunk = this.searchHandler(searchTerm);
        }

        const multiFiltersArr: IFilterGroup<IFilter<string[], IMultiFilterMetadata>>[] = this.extractMultiFilters(filters);
        // APPLY FILTERS with type 'string[]' if any
        if (multiFiltersArr?.length) {
            nextChunk = this.multiFilterHandler(nextChunk, multiFiltersArr);
        }

        const numberOfItems = nextChunk.length;

        // RESET PAGINATION if needed
        const filtersChanged = this.filtersChanged(
            filters,
            this.setItemsToCompare(filters, nextChunk, searchTerm, multiFiltersArr)
        );

        if (filtersChanged) {
            if (filters?.paginator) {
                const size = filters.paginator.value.end - filters.paginator.value.start;
                filters.paginator.value.start = 0;
                filters.paginator.value.end = size;
            }

            if (filters.virtualScroll) {
                // reset virtual scroll items
                this.virtualScrollData = [];
            }
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
                reset: filtersChanged,
            },
            ...this._allCategoriesResult,
        };
    }

    protected prepareData() {
        return this._allData;
    }

    protected searchHandler(searchTerm: any) {
        return this.searchService.search(this._allData, this._searchProps, searchTerm);
    }

    protected multiFilterHandler(nextChunk: any, multiFiltersArr: any) {
        const allCategoriesArr: IFilterItem<string[]>[] = multiFiltersArr
            .map((el: IFilterGroup<IFilter<string[], IMultiFilterMetadata>>) => this.getAllCategories(el));
        if (multiFiltersArr.length) {
            const filteredResult = this.searchThru(multiFiltersArr, nextChunk);
            const selectedFilters = this.getSelectedFilters(multiFiltersArr);
            // if some filters selected and filter result = 0, returning empty array
            if (filteredResult.length || selectedFilters.length) {
                nextChunk = _intersection(...filteredResult);
            }
        }
        // count number of occurrences of every item
        this._allCategoriesResult = this.countAvailableResults(allCategoriesArr, nextChunk);
        return nextChunk;
    }

    protected sortingHandler(filters: any, nextChunk: any) {
        if (_get(filters, "sorter.value.sortBy") && _get(filters, "sorter.value.direction")) {
            // Original direction means that sorting is not needed
            if (filters.sorter.value.direction !== SorterDirection.original) {
                return _orderBy(nextChunk, filters.sorter.value.sortBy, filters.sorter.value.direction);
            }
        }
        return nextChunk;
    }

    protected paginationHandler(filters: any, nextChunk: any) {
        if (filters?.paginator) {
            return nextChunk.slice(
                filters.paginator.value.start,
                filters.paginator.value.end
            );
        }
        return nextChunk;
    }

    protected virtualScrollHandler(filters: any, nextChunk: any) {
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

    /**
     * @deprecated - use filtersChanged instead
     */
    protected paginationReset(filters: any, itemsToCompare: any) {
        return this.filtersChanged(filters, itemsToCompare);
    }

    public filtersChanged(filters: any, itemsToCompare: any) {
        if (this._previousFilters) {
            if (this.isValueChanged(itemsToCompare)) {
                return true;
            }
        }
        return false;
    }

    protected setItemsToCompare(filters: F,
                                nextChunk: T[],
                                searchTerm: string | undefined,
                                multiFiltersArr: IFilterGroup<IFilter<string[], IMultiFilterMetadata>>[]) {
        // GET FILTERS from previous filtering
        const previousSortBy = _get(this._previousFilters, "sorter.value.sortBy");
        const previousDirection = _get(this._previousFilters, "sorter.value.direction");
        const previousSearchTerm = _get(this._previousFilters, "search.value");
        const previousMultiFiltersArr = this.extractMultiFilters(this._previousFilters);

        const sortBy = _get(filters, "sorter.value.sortBy");
        const direction = _get(filters, "sorter.value.direction");

        const itemsToCompare: ComparisonItems[] = [];
        itemsToCompare.push({ previousValue: previousSortBy, currentValue: sortBy });
        itemsToCompare.push({ previousValue: previousDirection, currentValue: direction });
        itemsToCompare.push({ previousValue: previousSearchTerm, currentValue: searchTerm });
        itemsToCompare.push({ previousValue: previousMultiFiltersArr, currentValue: multiFiltersArr });
        return itemsToCompare;
    }

    protected extractMultiFilters(filters: F): IFilterGroup<IFilter<string[], IMultiFilterMetadata>>[] {
        const multiFilterArr: IFilterGroup<IFilter<string[], IMultiFilterMetadata>>[] = [];
        _forEach(filters, (value, key) => {
            if (value?.type === "string[]") {
                multiFilterArr
                    .push({[key]: value} as any);
            }
        });
        return multiFilterArr;
    }

    private getSelectedFilters(multiFiltersArr: IFilterGroup<IFilter<string[], IMultiFilterMetadata>>[]): string[] {
        return multiFiltersArr.reduce((prev: string[], curr: IFilterGroup<IFilter<string[], IMultiFilterMetadata>>) =>
            prev.concat(curr[Object.keys(curr)[0]].value), []);
    }

    private countAvailableResults(allCategoriesArr: IFilterItem<string[]>[], nextChunk: T[]): IFilterGroup<IFilterItem<number>> {
        const allCategoriesResult: IFilterGroup<IFilterItem<number>[]>[] = allCategoriesArr.map((el, index) => {
            const key = Object.keys(el)[0];
            const valuesArr: string[] = allCategoriesArr[index][key];
            const resultArr = valuesArr.map((element: string) => {
                const r: T[] = this.searchService.search(nextChunk, [key], element);
                return { [element]: r.length };
            });
            return { [key]: resultArr };
        });

        return allCategoriesResult
            // convert array to an object
            .reduce((prev: any, curr: any) => {
                const [prop] = Object.keys(curr);
                // convert array to an object
                const newObj = curr[prop].reduce((previous: any, current: any) => {
                    const [property] = Object.keys(current);
                    previous[property] = current[property];
                    return previous;
                }, {});
                prev[prop] = newObj;
                return prev;
            }, {});
    }

    private searchThru(arrToMap: IFilterGroup<IFilter<string[], IMultiFilterMetadata>>[], arrToSearchIn: T[]) {
        // We are filtering out filter groups which doesn't have selected filters. If filters are not present,
        // it means that filtered data with this filters should not participate in intersection
        return arrToMap.filter(arr => !!arr[Object.keys(arr)[0]].value.length).map((multiFilter: IFilterGroup<IFilter<string[], IMultiFilterMetadata>>) => {
            const [prop] = Object.keys(multiFilter);
            return multiFilter[prop]
                // extract value array
                .value
                // find matches
                .map((el: string) =>
                    this.searchService.search(arrToSearchIn, [prop], el))
                // flatten returned multidimensional arrays
                .reduce((prev: T[], curr: T[]) =>
                    prev.concat(curr), []);
        });
    }

    private getAllCategories(multiFilter: IFilterGroup<IFilter<string[], IMultiFilterMetadata>>) {
        if (!multiFilter) { return; }
        const [prop] = Object.keys(multiFilter);
        const { metadata }: IFilter<string[], IMultiFilterMetadata> = multiFilter[prop];
        return { [prop]: metadata?.allCategories };
    }

    private isValueChanged(valuesArr: ComparisonItems[]) {
        for (const { previousValue, currentValue } of valuesArr) {
            if (!_isEqual(previousValue, currentValue)) {
                return true;
            }
        }
        return false;
    }

}
