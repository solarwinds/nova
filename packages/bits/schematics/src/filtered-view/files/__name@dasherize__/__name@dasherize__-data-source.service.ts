<% if (dataSource === "serverSide") {%>import { HttpClient, HttpParams } from "@angular/common/http";
<% } %>import { Injectable } from "@angular/core";
import {
    IDataSource,
    INovaFilteringOutputs,<%
    if (dataSource === "clientSide") {%>
    ClientSideDataSource,<% }
    if (dataSource==="serverSide") {%>
    LoggerService,
    ServerSideDataSource,<% } %>
} from "@nova-ui/bits";
import _forEach from "lodash/forEach";
import {<%
    if (dataSource === "serverSide") {%>
    forkJoin,<% } %>
    Observable,
    of,
} from "rxjs";
import {<%
    if (dataSource === "serverSide") {%>
    catchError,<% } %>
    delay,
    map,
} from "rxjs/operators";<%
if (dataSource === "clientSide" || pagingMode === "virtualScroll") {%>

import {<%
if (pagingMode === "virtualScroll") { %>
    RESULTS_PER_PAGE,<% }
if (dataSource === "clientSide") { %>
    LOCAL_DATA,<% } %>
} from "./<%= dasherize(name)%>-data";<% }

if (dataSource === "serverSide") {%>

import {
    IServerFilters,
    IServersApiResponse,
    IServersCollection,
} from "./types";
<% }
if (dataSource === "clientSide") {%>
import { IServersCollection, IServerFilters } from "./types";
<% }
if (dataSource === "serverSide") { %>
// @TODO customize the backend API URL
export const API_URL = "http://nova-pg.swdev.local/api/v1/servers";
<% } %>
/**
 * Example of a <%= classify(dataSource)%> DataSourceService<% if (dataSource==="serverSide") {%> which is using the Nova Backend API<% } %>
 * to fetch data
 */
@Injectable()
export class <%= classify(name) %>DataSource<T> extends <%
    if (dataSource === "clientSide") {%>ClientSideDataSource<%
    } else if (dataSource==="serverSide") {%>ServerSideDataSource<% } %><T> implements IDataSource {<%
    if (dataSource === "serverSide") {%>
    constructor(
        private logger: LoggerService<%
        if (dataSource === "serverSide") {%>,
        private http: HttpClient<% } %>
    ) {
        super();
    }

    // build query params specific to our backend API
    private static getRequestParams(filters: IServerFilters): HttpParams {
        const paging = filters.<%
        if (pagingMode === "pagination") {%>paginator<% }
        else if (pagingMode === "virtualScroll") {%>virtualScroll<% }
        %>?.value || { start: 0, end: 0 };
        let params = new HttpParams()
            // define the start page used by the virtual scroll internal "paginator"
            .set("page", Math.ceil(paging.start / (paging.end - paging.start)).toString())

            // specify the maximum number of items we need to fetch for each request
            .set("pageSize", String(<%
                if (pagingMode==="virtualScroll") {%>RESULTS_PER_PAGE<% }
                else if (pagingMode==="pagination") {%>paging.end - paging.start<% } %>));

        const multiFilters = this.extractMultiFilters(filters);
        if (multiFilters.size) {
            // set params if any filters
            const json = Array.from(multiFilters.entries())
                .reduce((o: {[key: string]: any}, [key, value]) => {
                    o[key] = value;
                    return o;
                }, {});
            params = params.set("filters", JSON.stringify(json));
        }<%
        if (enableSearch) {%>

        if (filters.search?.value) {
            params = params.set("searchField", "name");
            params = params.set("searchContent", filters.search?.value ?? "");
        }<% }
        if (enableSort) {%>

        if (filters.sorter?.value?.sortBy) {
            params = params.set("sortField", filters.sorter.value.sortBy);
            params = params.set("sortOrder", filters.sorter.value.direction.toUpperCase());
        }<% } %>

        return params;
    }<% } %>

    private static getMultiFiltersNames(filters: IServerFilters): (keyof IServerFilters)[] {
        const filterKeys: (keyof IServerFilters)[] = [];
        _forEach(filters, (value, key) => {
            if (value?.type === "string[]") {
                filterKeys.push(key);
            }
        });

        return filterKeys;
    }

    private static extractMultiFilters(filters: IServerFilters): Map<keyof IServerFilters, string[]> {
        const multiFilterArr: Map<string, string[]> = new Map<string, string[]>();
        _forEach(filters, (value, key) => {
            if (value?.type === "string[]" && value?.value?.length > 0) {
                multiFilterArr.set(key, value?.value);
            }
        });

        return multiFilterArr;
    }

    public async getFilteredData(filters: IServerFilters): Promise<INovaFilteringOutputs> {
        return this.getBackendData(filters).pipe(
            map((response: IServersCollection) => {
                const itemsSource = <%
                    if (pagingMode === "none") {%>LOCAL_DATA<%
                    } else if (pagingMode === "virtualScroll" || pagingMode === "pagination") {%>response.items<%
                    } else {%>[]<% }
                %>;

                return {
                    repeat: { itemsSource: itemsSource },
                    paginator: {
                        total: response.count,
                    },
                    status: response.status,
                    location: response.location,
                };
            })
        ).toPromise();
    }

    // This method is expected to return all data needed for repeat/paginator/filterGroups in order to work.
    // In case of custom filtering participants feel free to extend INovaFilteringOutputs.
    protected getBackendData(filters: IServerFilters): Observable<IServersCollection> {<%
    if (dataSource === "clientSide") { %>
        // Typically here you'll have your http service calls here using filters as parameters.
        // Filters (IServerFilters) are data from filterGroups/paginator/sorter etc.
        let data = LOCAL_DATA;
        <% if (enableSearch) {%>

        if (filters.search?.value) {
            data = data.filter(item => item.name.toLowerCase().indexOf(filters.search.value.toLowerCase() ?? "") >= 0);
        }<% }
        if (enableSort) {%>

        if (filters.sorter?.value) {
            data = data.sort((a, b) => {
                const sortBy = filters.sorter.value.sortBy;
                return a[sortBy].localeCompare(b[sortBy]) * (filters.sorter.value.direction === "asc" ? 1 : -1)
            });
        }<% }
        if (pagingMode === "none") {%>
        let items = LOCAL_DATA;<% } else {%>
        const paging = filters.<%
        if (pagingMode === "pagination") {%>paginator<% }
        else if (pagingMode === "virtualScroll") {%>virtualScroll<% }
        %>;
        let items = data.slice(paging.value.start, paging.value.end);
        <% } %>
        return of({
            items: items,
            count: data.length,
            status: filters.status,
            location: filters.location,
        }).pipe(delay(300));
        <% }
        if (dataSource === "serverSide") {%>
        // fetch response from the backend
        const requestParams = <%= classify(name) %>DataSource.getRequestParams(filters);
        const mainRequest = this.http.get<IServersApiResponse>(API_URL, {params: requestParams});
        const requests = [mainRequest];

        // cleans any filter that we don't need
        let filterRequestParams = requestParams;
        ["page", "pageSize", "sortField", "sortOrder"].forEach(f => {
            filterRequestParams = filterRequestParams.delete(f);
        });

        const lastFilters = filterRequestParams.get("filters") ?? "{}";

        // perform additional requests to retrieve the count for each filter group (eg: status, location)
        <%= classify(name) %>DataSource.getMultiFiltersNames(filters).forEach(filterName => {
            const serverFilters = Object.assign({}, JSON.parse(lastFilters));
            // always removes the current filter before the API call
            if (serverFilters[filterName]) {
                delete serverFilters[filterName];
                filterRequestParams = filterRequestParams.set("filters", JSON.stringify(serverFilters));
            }

            filterRequestParams = filterRequestParams.set("groupByField", filterName.toString());
            const filterViewRequest = this.http.get<IServersApiResponse>(
                `${API_URL}/count`, { params: filterRequestParams });

            // restore the filters
            filterRequestParams = filterRequestParams.set("filters", lastFilters);

            requests.push(filterViewRequest);
        });

        // transform the and array that has unique keys from the backend
        // from => [{Active: 10}, {Down: 5}] => {{Active: 10}, {Down: 5}}
        const flatCount = (mapObj: any, obj: any) => {
            const key = Object.keys(obj)[0];
            mapObj[key] = Object.values(obj)[0];
            return mapObj;
        };

        return forkJoin(requests).pipe(
            // since API being used sends the response almost immediately,
            // we need to fake it takes longer to be able the show the spinner component
            // while the data is being received
            // PS: NOT to be used in real examples
            delay(300),

            // transform backend API response (IServersApiResponse)
            // to our frontend items collection (IServersCollection)
            map(([mainResponse, statusResponse, locationResponse]) => ({
                items: mainResponse.items?.map(item => ({
                    name: item.name,
                    location: item.location,
                    status: item.status,
                })) || [],
                count: mainResponse.count,
                status: statusResponse.items?.reduce(flatCount, {}),
                location: locationResponse.items?.reduce(flatCount, {}),
            })),

            // error handle in case of any error
            catchError(e => {
                this.logger.error(e);
                return of({
                    items: [],
                    count: 0,
                });
            }),
        );<% } %>
    }
}
