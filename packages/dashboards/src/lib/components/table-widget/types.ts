// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { IFormatter } from "../types";
import {
    ITableSelectionConfigDisabled,
    ITableSelectionConfigEnabled,
    TableSelectionConfig,
    TableSelectionMode,
} from "@nova-ui/bits";

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
    /**
     * Allows to choose row selection behavior of a table.
     * Can be None | Multi | Single | Radio.
     */
    selectionConfiguration?: TableWidgetSelectionConfig;
    /**
     * @deprecated Use scrollType and set it to "infinite" instead
     */
    hasVirtualScroll?: boolean;
    scrollType?: ScrollType;
    /**
     * Makes table rows interactive.
     * Disabled if 'selectable' is set to true.
     */
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

    paginatorConfiguration?: ITableWidgetPaginatorConfig;
}

export interface ITableWidgetSorterConfig {
    descendantSorting: boolean;
    sortBy: string;
}

export interface ITableWidgetPaginatorConfig {
    pageSizeSet?: number[];
    pageSize?: number;
}

export interface IPaginatorState {
    page: number;
    pageSize: number;
    pageSizeSet: number[];
    total: number;
}

export enum ScrollType {
    virtual = "virtual",
    paginator = "paginator",
    default = "default",
}

interface ITableWidgetSelectionConfigEnabled
    extends ITableSelectionConfigEnabled {
    /**
     * Property name that is unique.
     * Needs to be set in order for selection to work in combination with filtering.
     *
     * Using property that is not unique across table data will result in a selection
     * of all rows with the same column value at once.

     @default "id"
     */
    trackByProperty?: string;
    /**
     * If clicking on row should select it.
     * True if selectionMode is set to "single".
     * @default false
     */
    clickableRow?: boolean;
}

interface ITableWidgetSelectionConfigDisabled
    extends ITableSelectionConfigDisabled {}

export type TableWidgetSelectionConfig =
    | ITableWidgetSelectionConfigEnabled
    | ITableSelectionConfigDisabled;
