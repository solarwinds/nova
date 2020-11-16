import { IFilter, INovaFilters } from "@solarwinds/nova-bits";

// main model being processed & rendered in the frontend
export interface IServer {
    Subregion: ISubregion;
}

// implement custom filters
export interface IServerFilters extends INovaFilters {
    language?: IFilter<string[]>;
    currency?: IFilter<string[]>;
    subregion?: IFilter<string[]>;
}

// collection of items that we've transformed from the backend API
export interface IServersCollection {
    Subregion: ITreeNode[];
}

export interface IFilterable {
    applyFilters: () => Promise<void>;
}

export interface ITreeNode {
    name: string;
    code?: string;
    children?: any[];
}

export interface ISubregion {
    name: string;
    countries: Array<ICountry>;
}

interface ICountry {
    name: string;
    population: string;
    officialLanguages: Array<ILanguage>;
    currencies: Array<ICurrency>;
}

interface ILanguage {
    name: string;
}

interface ICurrency {
    code: string;
}
