import { IMultiFilterMetadata } from "@solarwinds/nova-bits";

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
