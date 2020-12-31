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
    location?: IFilter<string>;
    name?: IFilter<string>;
    status?: IFilter<ServerStatus>;
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
