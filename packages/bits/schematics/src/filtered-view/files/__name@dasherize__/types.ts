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

<% if (dataSource !== "custom") {%>import { IFilter, INovaFilters } from "@nova-ui/bits";
<% } %>
export enum ServerStatus {
    active = "Active",
    down = "Down",
}
<% if (dataSource !== "custom") {%>
// main model being processed & rendered in the frontend
export interface IServer {
    location: string;
    name: string;
    status: ServerStatus;
}

// implement custom filters
export interface IServerFilters extends INovaFilters {
    name?: IFilter<string>;
    status?: IFilter<Record<string, number>>;
    location?: IFilter<Record<string, number>>;
}
<% }

if (dataSource === "serverSide") { %>
// collection of items that we've received from the backend API response
export interface IServersApiResponse {
    count: number;
    items: IServer[];
}
<% } %>
// collection of items that we've transformed from the backend API
export interface IServersCollection {
    items: IServer[];
    count: number;
    status?: IFilter<Record<string, number>>;
    location?: IFilter<Record<string, number>>;
}<%
if (chips) { %>

export interface IFilterable {
    applyFilters: () => Promise<void>;
}<% } %>
