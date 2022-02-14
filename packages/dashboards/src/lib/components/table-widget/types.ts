import { IFormatter } from "../types";

export interface ITableWidgetColumnConfig {
    id: string;
    label: string;
    /**
     * Possibility to show or hide column without removing it
     */
    isActive?: boolean;
    /**
     * Formatter configuration
     */
    formatter?: IFormatter;
    /**
     * Width of the column
     */
    width?: number;
    /**
     * If column is sortable
     */
    sortable?: boolean;
}

export interface ITableWidgetConfig {
    reorderable?: boolean;
    columns: Array<ITableWidgetColumnConfig>;
    sortable?: boolean;
    sorterConfiguration: ITableWidgetSorterConfig;
    hasVirtualScroll: boolean;
    interactive?: boolean;
    headerTooltipsEnabled?: boolean;
    scrollActivationDelayMs?: number;
    /**
     * Selectors for target elements to be ignored for row click.
     *
     * Default value ["button", "input[type='button']", "a[href]"]
     */
    interactionIgnoredSelectors?: string[];

    searchConfiguration?: {
        enabled: boolean;
        searchTerm?: string;
        searchDebounce?: number;
    };
}

export interface ITableWidgetSorterConfig {
    descendantSorting: boolean;
    sortBy: string;
}
