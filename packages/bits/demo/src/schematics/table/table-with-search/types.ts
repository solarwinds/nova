import { IFilter, INovaFilters } from "@solarwinds/nova-bits";

export enum ServerStatus {
    active = "Active",
    down = "Down",
}

// main server model being received from the backend
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

// collection of items that we've received from the backend API response
export interface IServersApiResponse {
    count: number;
    items: IServer[];
}

// collection of items that we've transformed from the backend API
export interface IServersCollection {
    items: IServer[];
    count: number;
}
