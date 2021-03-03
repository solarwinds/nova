import { IFilter, INovaFilters } from "@nova-ui/bits";

// main server model being received from the backend
export interface IServer {
    location: string;
    name: string;
    status: string;
}

// implement custom filters
export interface IServerFilters extends INovaFilters {
    location?: IFilter<string>;
    name?: IFilter<string>;
    status?: IFilter<string>;
}

// collection of items that we've transformed from the backend API
export interface IServersCollection {
    items: IServer[];
}
