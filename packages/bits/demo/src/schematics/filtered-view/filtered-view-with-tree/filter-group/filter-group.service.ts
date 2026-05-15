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

import { Injectable } from "@angular/core";
import _difference from "lodash/difference";
import _flatten from "lodash/flatten";

import { IFilterGroupItem, IFilterGroupOption } from "./public-api";

@Injectable()
export class FilterGroupService {
    /**
     *
     * @param filterGroupItem FilterGroupItem with updated selectedFilterValues
     * @returns IFilterGroupItem with updated itemsToDisplay and properly reordered allFilterOptions.
     */
    public appendHiddenFilters(
        filterGroupItem: IFilterGroupItem
    ): IFilterGroupItem {
        const valuesToAppend: any[] = [];
        let numberToDisplay = filterGroupItem.itemsToDisplay
            ? filterGroupItem.itemsToDisplay
            : 10;
        const displayedCheckboxesValues = filterGroupItem.allFilterOptions
            .slice(0, numberToDisplay)
            .map((item) => item.value);
        const checkedCheckboxes = filterGroupItem.selectedFilterValues;
        const difference = _difference(
            checkedCheckboxes,
            displayedCheckboxesValues
        );
        if (difference.length !== 0) {
            difference.forEach((diff) => {
                valuesToAppend.push(
                    filterGroupItem.allFilterOptions.filter(
                        (item) => item.value === diff
                    )
                );
            });
            const flattenedValuesToAppend: IFilterGroupOption[] =
                _flatten(valuesToAppend);
            flattenedValuesToAppend.forEach((item) => {
                filterGroupItem.allFilterOptions.splice(
                    filterGroupItem.allFilterOptions.indexOf(item),
                    1
                );
                filterGroupItem.allFilterOptions.splice(
                    numberToDisplay,
                    0,
                    item
                );
                numberToDisplay += 1;
            });
            filterGroupItem.itemsToDisplay = numberToDisplay;
        }
        return { ...filterGroupItem };
    }
}
