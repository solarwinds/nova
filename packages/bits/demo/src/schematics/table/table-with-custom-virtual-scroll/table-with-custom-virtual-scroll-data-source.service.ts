import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    IDataSource,
    INovaFilteringOutputs,
    LoggerService,
    ServerSideDataSource,
} from "@solarwinds/nova-bits";
import { Observable, of } from "rxjs";
import {
    catchError,
    delay,
    map,
} from "rxjs/operators";

import {
    RESULTS_PER_PAGE,
} from "./table-with-custom-virtual-scroll-data";
import {
    IServerFilters,
    IServersApiResponse,
    IServersCollection,
} from "./types";

// @TODO customize the backend API URL
export const API_URL = "http://nova-pg.swdev.local/api/v1/servers";

/**
 * Example of a ServerSide DataSourceService which is using the Nova Backend API
 * to fetch data
 */
@Injectable()
export class TableWithCustomVirtualScrollDataSource<T> extends ServerSideDataSource<T> implements IDataSource {
    constructor(
        private logger: LoggerService,
        private http: HttpClient
    ) {
        super();
    }

    // build query params specific to our backend API
    private static getRequestParams(filters: IServerFilters): HttpParams {
        const paging = filters.virtualScroll?.value || { start: 0, end: 0 };
        let params = new HttpParams()
            // define the start page used by the virtual scroll internal "paginator"
            .set("page", Math.ceil(paging.start / (paging.end - paging.start)).toString())

            // specify the maximum number of items we need to fetch for each request
            .set("pageSize", String(RESULTS_PER_PAGE))
            .set("searchField", "name")
            .set("searchContent", filters.search?.value ?? "");

        if (filters.sorter?.value?.sortBy) {
            params = params.set("sortField", filters.sorter.value.sortBy);
            params = params.set("sortOrder", filters.sorter.value.direction.toUpperCase());
        }

        return params;
    }

    public async getFilteredData(data: IServersCollection): Promise<INovaFilteringOutputs> {
        return of(data).pipe(
            map((response: IServersCollection) => {
                const itemsSource = response.items;

                return {
                    repeat: { itemsSource: itemsSource },
                    paginator: {
                        total: response.count,
                    },
                };
            })
        ).toPromise();
    }

    // This method is expected to return all data needed for repeat/paginator/filterGroups in order to work.
    // In case of custom filtering participants feel free to extend INovaFilteringOutputs.
    protected getBackendData(filters: IServerFilters): Observable<IServersCollection> {
        // fetch response from the backend
        const requestParams = TableWithCustomVirtualScrollDataSource.getRequestParams(filters);
        return this.http
            .get<IServersApiResponse>(API_URL, {params: requestParams})
            .pipe(
                // since API being used sends the response almost immediately,
                // we need to fake it takes longer to be able the show the spinner component
                // while the data is being received
                // PS: NOT to be used in real examples
                delay(300),

                // transform backend API response (IServersApiResponse)
                // to our frontend items collection (IServersCollection)
                map(response => ({
                    items: response.items?.map(item => ({
                        name: item.name,
                        location: item.location,
                        status: item.status,
                    })) || [],
                    count: response.count,
                })),

                // error handle in case of any error
                catchError(e => {
                    this.logger.error(e);
                    return of({
                        items: [],
                        count: 0,
                    });
                })
            );
    }
}
