import { ListRange } from "@angular/cdk/collections";
import { Injectable } from "@angular/core";
import { DataSourceFeatures, DataSourceService, IDataSource, INovaFilteringOutputs, INovaFilters, ISorterFilter, LoggerService } from "@nova-ui/bits";
import { IDataField, WellKnownDataSourceFeatures } from "@nova-ui/dashboards";
import isEqual from "lodash/isEqual";
import orderBy from "lodash/orderBy";
import { BehaviorSubject } from "rxjs";

import { IBrewDatasourceResponse, IBrewInfo } from "../../../types";

import { BREW_API_URL } from "./constants";

@Injectable()
export class AcmeTableDataSource3 extends DataSourceService<IBrewInfo> implements IDataSource {
    public static providerId = "AcmeTableDataSource3";

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

    public async getFilteredData(filters: INovaFilters): Promise<INovaFilteringOutputs> {
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
            if (!isEqual(this.lastSortValue, filters.sorter.value) && filters.virtualScroll?.value.start === 0 && !!this.lastVirtualScroll) {
                const totalPages = Math.ceil(delta ? this.totalItems / delta : 1);
                const itemsPerPage: number = Math.max(delta < 80 ? delta : 80, 1);
                let response: Array<IBrewInfo> | null = null;
                let map: IBrewDatasourceResponse;

                if (filters.sorter?.value?.direction === "desc") {
                    this.cache = [];
                    for (let i = 0; i < this.page; ++i) {

                        response = await
                            (await fetch(`${BREW_API_URL}/?page=${totalPages - i || 1}&per_page=${itemsPerPage}`)).json();

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
                        this.cache = totalPages - i !== 0 ? this.cache.concat(map.brewInfo) : this.cache;
                    }
                }

                if (filters.sorter?.value?.direction === "asc") {
                    this.cache = [];
                    for (let i = 0; i < this.page; i++) {
                        response = await
                            (await fetch(`${BREW_API_URL}/?page=${i + 1}&per_page=${itemsPerPage}`)).json();
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
                        repeat: { itemsSource: this.sortData(this.cache, filters) },
                        paginator: { total: this.totalItems },
                        dataFields: this.dataFields,
                    },
                };
            }
        }

        this.busy.next(true);
        return new Promise(resolve => {
            setTimeout(() => {
                this.getData(start, end, filters).then((response: INovaFilteringOutputs) => {
                    if (!response) {
                        return;
                    }

                    this.cache = this.cache.concat(response.brewInfo);

                    this.dataSubject.next(this.cache);
                    resolve({
                        result: {
                            repeat: { itemsSource: this.sortData(this.cache, filters) },
                            paginator: { total: this.totalItems },
                            dataFields: this.dataFields,
                        },
                    });

                    this.lastSortValue = filters.sorter?.value;
                    this.lastVirtualScroll = filters.virtualScroll?.value;
                    this.busy.next(false);
                });
            }, 500);
        });
    }

    public async getData(start: number = 0, end: number = 20, filters: INovaFilters): Promise<INovaFilteringOutputs> {
        const delta = end - start;
        const totalPages = Math.ceil(delta ? this.totalItems / delta : 1);
        let response: Array<IBrewInfo> | null = null;
        // The api.punk.com is able to return only 80 items per page
        const itemsPerPage: number = Math.max(delta < 80 ? delta : 80, 1);

        if (filters.sorter?.value?.direction === "asc") {
            response = await (await fetch(`${BREW_API_URL}/?page=${this.page}&per_page=${itemsPerPage}`)).json();
        }

        if (filters.sorter?.value?.direction === "desc") {
            response = await (await fetch(`${BREW_API_URL}/?page=${totalPages - this.page}&per_page=${itemsPerPage}`)).json();
        }

        if (!filters.sorter) {
            response = await (await fetch(`${BREW_API_URL}/?page=${this.page}&per_page=${itemsPerPage}`)).json();
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
        return orderBy(data, filters.sorter?.value?.sortBy, filters.sorter?.value?.direction as "desc" | "asc");
    }
}
