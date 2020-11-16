import { IFilter, INovaFilters } from "@solarwinds/nova-bits";

export enum ServerStatus {
    active = "Active",
    down = "Down",
}

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

// collection of items that we've transformed from the backend API
export interface IServersCollection {
    items: IServer[];
    count: number;
    status?: IFilter<Record<string, number>>;
    location?: IFilter<Record<string, number>>;
}

export interface IFilterable {
    applyFilters: () => Promise<void>;
}
