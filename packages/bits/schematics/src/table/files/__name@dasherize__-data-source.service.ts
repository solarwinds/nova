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

<% if (dataSource === "serverSide") {%>import { HttpClient, HttpParams } from "@angular/common/http";
<% } %>import { Injectable } from "@angular/core";
import {
    IDataSource,
    INovaFilteringOutputs,<%
    if (dataSource==="clientSide") {%>
    ClientSideDataSource,<% }
    if (dataSource==="serverSide") {%>
    LoggerService,
    ServerSideDataSource,<% } %>
} from "@nova-ui/bits";
import { Observable, of } from "rxjs";
import {<%
    if (dataSource === "serverSide") {%>
    catchError,<% } %>
    delay,
    map,
} from "rxjs/operators";
<% if (dataSource === "clientSide" || pagingMode === "virtualScroll") {%>
import {
    <% if (pagingMode === "virtualScroll") { %>RESULTS_PER_PAGE,<% }
    if (dataSource === "clientSide") { %>LOCAL_DATA,<% } %>
} from "./<%= dasherize(name)%>-data";<% }
if (dataSource === "serverSide") {%>
import {
    IServerFilters,
    IServersApiResponse,
    IServersCollection,
} from "./types";
<% }
if (dataSource === "clientSide") {%>
import {<% if (pagingMode === "virtualScroll") {%>
    IServer,<% } %>
    IServersCollection,
} from "./types";
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
        <% if (enableSort) {%>let<% } else { %>const<% } %> params = new HttpParams()
            // define the start page used by the virtual scroll internal "paginator"
            .set("page", Math.ceil(paging.start / (paging.end - paging.start)).toString())

            // specify the maximum number of items we need to fetch for each request
            .set("pageSize", String(<%
                if (pagingMode==="virtualScroll") {%>RESULTS_PER_PAGE<% }
                else if (pagingMode==="pagination") {%>paging.end - paging.start<% } %>))
            .set("searchField", "name")
            .set("searchContent", filters.search?.value ?? "");<%
        if (enableSort) {%>

        if (filters.sorter?.value?.sortBy) {
            params = params.set("sortField", filters.sorter.value.sortBy);
            params = params.set("sortOrder", filters.sorter.value.direction.toUpperCase());
        }<% } %>

        return params;
    }<% } %>

    public async getFilteredData(data: IServersCollection): Promise<INovaFilteringOutputs> {
        return of(data).pipe(
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
        let data = LOCAL_DATA;<%
        if (enableSearch) {%>
        if (filters.search?.value) {
            data = data.filter(item => item.name.toLowerCase().indexOf(filters.search.value.toLowerCase() ?? "") >= 0);
        }<% }
        if (enableSort) {%>
        if (filters.sorter?.value) {
            data = data.sort((a, b) => {
                const sortBy = filters.sorter.value.sortBy;
                return a[sortBy].localeCompare(b[sortBy]) * (filters.sorter.value.direction === "asc" ? 1 : -1)
            });
        }
        <% }
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
        }).pipe(delay(300));<% }
        if (dataSource === "serverSide") {%>
        // fetch response from the backend
        const requestParams = <%= classify(name) %>DataSource.getRequestParams(filters);
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
            );<% } %>
    }
}
