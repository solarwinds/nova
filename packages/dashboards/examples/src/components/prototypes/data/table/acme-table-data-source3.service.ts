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

import { ListRange } from "@angular/cdk/collections";
import { Injectable } from "@angular/core";
import isEqual from "lodash/isEqual";
import orderBy from "lodash/orderBy";
import { BehaviorSubject } from "rxjs";

import {
    DataSourceFeatures,
    DataSourceService,
    IDataField,
    IDataSource,
    INovaFilteringOutputs,
    INovaFilters,
    ISorterFilter,
    LoggerService,
} from "@nova-ui/bits";
import { WellKnownDataSourceFeatures } from "@nova-ui/dashboards";

import { BREW_API_URL } from "./constants";
import { IBrewDatasourceResponse, IBrewInfo } from "../../../types";

@Injectable()
export class AcmeTableDataSourceNoColumnGeneration
    extends DataSourceService<IBrewInfo>
    implements IDataSource
{
    public static providerId = "AcmeTableDataSourceNoColumnGeneration";

    private cache = Array.from<IBrewInfo>({ length: 0 });
    private lastSortValue?: ISorterFilter;
    private lastVirtualScroll?: ListRange;
    private totalItems: number = 325;

    public page: number = 1;
    public busy = new BehaviorSubject(false);

    // disable column generation for this data source
    public features = new DataSourceFeatures({
        [WellKnownDataSourceFeatures.DisableTableColumnGeneration]: {
            enabled: true,
        },
    });

    public dataFields: Array<IDataField> = [
        { id: "id", label: "No", dataType: "number" },
        { id: "name", label: "Name", dataType: "string" },
        { id: "tagline", label: "Tagline", dataType: "string" },
        { id: "first_brewed", label: "First Brewed", dataType: "string" },
        { id: "description", label: "Description", dataType: "string" },
        { id: "brewers_tips", label: "Brewer's Tips", dataType: "string" },
    ];

    constructor(private logger: LoggerService) {
        super();
    }

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<INovaFilteringOutputs> {
        const start = filters.virtualScroll?.value?.start ?? 0;
        const end = filters.virtualScroll?.value?.end ?? 0;
        const delta = end - start;

        // Note: We should start with a clean cache every time first page is requested
        if (start === 0) {
            this.cache = [];
        }

        // This condition handles sorting. We want to sort columns without fetching another chunk of data.
        // Since the data is being fetched when scrolled, we compare virtual scroll indexes here in the condition as well.
        if (filters.sorter?.value) {
            if (
                !isEqual(this.lastSortValue, filters.sorter.value) &&
                filters.virtualScroll?.value.start === 0 &&
                !!this.lastVirtualScroll
            ) {
                const totalPages = Math.ceil(
                    delta ? this.totalItems / delta : 1
                );
                const itemsPerPage: number = Math.max(
                    delta < 80 ? delta : 80,
                    1
                );
                let response: Array<IBrewInfo> | null = null;
                let map: IBrewDatasourceResponse;

                if (filters.sorter?.value?.direction === "desc") {
                    this.cache = [];
                    for (let i = 0; i < this.page; ++i) {
                        response = await (
                            await fetch(
                                `${BREW_API_URL}/?page=${
                                    totalPages - i || 1
                                }&per_page=${itemsPerPage}`
                            )
                        ).json();

                        // since the last page contains only 5 items we need to fetch another page to give virtual scroll enough space to work
                        if (response && response.length < itemsPerPage) {
                            this.page++;
                        }
                        map = {
                            brewInfo: response?.map((result: IBrewInfo) => ({
                                id: result.id,
                                name: result.name,
                                tagline: result.tagline,
                                first_brewed: result.first_brewed,
                                description: result.description,
                                brewers_tips: result.brewers_tips,
                            })),
                            total: response?.length,
                        } as IBrewDatasourceResponse;
                        this.cache =
                            totalPages - i !== 0
                                ? this.cache.concat(map.brewInfo)
                                : this.cache;
                    }
                }

                if (filters.sorter?.value?.direction === "asc") {
                    this.cache = [];
                    for (let i = 0; i < this.page; i++) {
                        response = await (
                            await fetch(
                                `${BREW_API_URL}/?page=${
                                    i + 1
                                }&per_page=${itemsPerPage}`
                            )
                        ).json();
                        map = {
                            brewInfo: response?.map((result: IBrewInfo) => ({
                                id: result.id,
                                name: result.name,
                                tagline: result.tagline,
                                first_brewed: result.first_brewed,
                                description: result.description,
                                brewers_tips: result.brewers_tips,
                            })),
                            total: response?.length,
                        } as IBrewDatasourceResponse;
                        this.cache = this.cache.concat(map.brewInfo);
                    }
                }

                this.lastSortValue = filters.sorter?.value;
                this.lastVirtualScroll = filters.virtualScroll?.value;

                return {
                    result: {
                        repeat: {
                            itemsSource: this.sortData(this.cache, filters),
                        },
                        paginator: { total: this.totalItems },
                        dataFields: this.dataFields,
                    },
                };
            }
        }

        this.busy.next(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                this.getData(start, end, filters).then(
                    (response: INovaFilteringOutputs) => {
                        if (!response) {
                            return;
                        }

                        this.cache = this.cache.concat(response.brewInfo);

                        this.dataSubject.next(this.cache);
                        resolve({
                            result: {
                                repeat: {
                                    itemsSource: this.sortData(
                                        this.cache,
                                        filters
                                    ),
                                },
                                paginator: { total: this.totalItems },
                                dataFields: this.dataFields,
                            },
                        });

                        this.lastSortValue = filters.sorter?.value;
                        this.lastVirtualScroll = filters.virtualScroll?.value;
                        this.busy.next(false);
                    }
                );
            }, 500);
        });
    }

    public async getData(
        start: number = 0,
        end: number = 20,
        filters: INovaFilters
    ): Promise<INovaFilteringOutputs> {
        const delta = end - start;
        const totalPages = Math.ceil(delta ? this.totalItems / delta : 1);
        let response: Array<IBrewInfo> | null = null;
        // The api.punk.com is able to return only 80 items per page
        const itemsPerPage: number = Math.max(delta < 80 ? delta : 80, 1);

        if (filters.sorter?.value?.direction === "asc") {
            response = await (
                await fetch(
                    `${BREW_API_URL}/?page=${this.page}&per_page=${itemsPerPage}`
                )
            ).json();
        }

        if (filters.sorter?.value?.direction === "desc") {
            response = await (
                await fetch(
                    `${BREW_API_URL}/?page=${
                        totalPages - this.page
                    }&per_page=${itemsPerPage}`
                )
            ).json();
        }

        if (!filters.sorter) {
            response = await (
                await fetch(
                    `${BREW_API_URL}/?page=${this.page}&per_page=${itemsPerPage}`
                )
            ).json();
        }
        return {
            brewInfo: response?.map((result: IBrewInfo, i: number) => ({
                id: result.id,
                name: result.name,
                tagline: result.tagline,
                first_brewed: result.first_brewed,
                description: result.description,
                brewers_tips: result.brewers_tips,
            })),
            total: response?.length,
        } as IBrewDatasourceResponse;
    }

    private sortData(data: IBrewInfo[], filters: INovaFilters) {
        return orderBy(
            data,
            filters.sorter?.value?.sortBy,
            filters.sorter?.value?.direction as "desc" | "asc"
        );
    }
}
