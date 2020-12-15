import { IFilteringOutputs, IMultiFilterMetadata } from "@nova-ui/bits";

export interface IFilterGroupItem {
    id: string;
    title: string;
    allFilterOptions: IFilterGroupOption[];
    selectedFilterValues: string[];
    expanded?: boolean;
    itemsToDisplay?: number;
}

export interface IFilterGroupOption {
    value: string;
    displayValue: string;
    count?: number;
}

export interface IFilterGroupMultiFilterMetadata extends IMultiFilterMetadata {
    expanded: boolean;
}


export interface ExampleItem {
    color: string;
    status: string;
}

export interface ICustomDSFilteredData {
    filterGroupItems?: IFilterGroupItem[];
    filteringState?: IFilteringOutputs;
}
