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
