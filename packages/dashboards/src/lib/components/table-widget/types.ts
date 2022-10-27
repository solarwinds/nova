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
