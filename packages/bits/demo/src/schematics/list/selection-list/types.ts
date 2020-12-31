import { IFilter, INovaFilters } from "@nova-ui/bits";

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
