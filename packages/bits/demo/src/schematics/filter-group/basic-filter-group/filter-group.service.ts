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
    public appendHiddenFilters(filterGroupItem: IFilterGroupItem): IFilterGroupItem {
        const valuesToAppend: any[] = [];
        let numberToDisplay = filterGroupItem.itemsToDisplay ? filterGroupItem.itemsToDisplay : 10;
        const displayedCheckboxesValues = filterGroupItem.allFilterOptions
            .slice(0, numberToDisplay)
            .map(item => item.value);
        const checkedCheckboxes = filterGroupItem.selectedFilterValues;
        const difference = _difference(checkedCheckboxes, displayedCheckboxesValues);
        if (difference.length !== 0) {
            difference.forEach(diff => {
                valuesToAppend.push(filterGroupItem.allFilterOptions.filter(item => item.value === diff));
            });
            const flattenedValuesToAppend: IFilterGroupOption[] = _flatten(valuesToAppend);
            flattenedValuesToAppend.forEach(item => {
                filterGroupItem.allFilterOptions.splice(filterGroupItem.allFilterOptions.indexOf(item), 1);
                filterGroupItem.allFilterOptions.splice(numberToDisplay, 0, item);
                numberToDisplay += 1;
            });
            filterGroupItem.itemsToDisplay = numberToDisplay;
        }
        return {...filterGroupItem};
    }

}
