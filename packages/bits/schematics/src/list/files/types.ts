<% if (enableSearch || pagingMode === "virtualScroll" || (pagingMode === "pagination" && dataSource === "serverSide")) {%>import { IFilter, INovaFilters } from "@nova-ui/bits";

<% } %>export enum ServerStatus {
    active = "Active",
    down = "Down",
}

// main server model being received from the backend
export interface IServer {
    location: string;
    name: string;
    status: ServerStatus;
}<%
if (enableSearch || (dataSource === "clientSide" || dataSource === "serverSide")) {%>

// implement custom filters
export interface IServerFilters extends INovaFilters {
    name?: IFilter<string>;
    status?: IFilter<Record<string, number>>;
    location?: IFilter<Record<string, number>>;
}<% }
if (dataSource === "serverSide") { %>

// collection of items that we've received from the backend API response
export interface IServersApiResponse {
    count: number;
    items: IServer[];
}

// collection of items that we've transformed from the backend API
export interface IServersCollection {
    items: IServer[];
    count: number;
    status?: IFilter<Record<string, number>>;
    location?: IFilter<Record<string, number>>;
}<% } %>
