import { Injectable, Optional, TrackByFunction } from "@angular/core";
import _differenceWith from "lodash/differenceWith";
import _intersectionWith from "lodash/intersectionWith";
import _isEqual from "lodash/isEqual";
import _isUndefined from "lodash/isUndefined";
import _reject from "lodash/reject";
import _unionWith from "lodash/unionWith";

import { LoggerService } from "../../services/log-service";
import {
    ISelection,
    ISelectorState,
    SelectionModel,
} from "../../services/public-api";
import { IMenuGroup } from "../menu/public-api";
import { RepeatSelectionMode } from "../repeat/types";
import { CheckboxStatus, SelectionType } from "./public-api";

/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class SelectorService {
    /**
     * Map if SelectionType to internationalized selector options
     */
    public i18nTitleMap: Record<string, string> = {};

    constructor(@Optional() private logger?: LoggerService) {
        this.i18nTitleMap[
            SelectionType.All
        ] = $localize`Select all items on this page`;
        this.i18nTitleMap[
            SelectionType.AllPages
        ] = $localize`Select all items on all pages`;
        this.i18nTitleMap[SelectionType.None] = $localize`Unselect all items`;
        this.i18nTitleMap[
            SelectionType.UnselectAll
        ] = $localize`Unselect all items on this page`;
    }

    // TODO: think about an ability to provide isEqual function from outside

    /**
     * Allows to react on changes of a selector component.
     * If user has selected one of the options in a selector (Select all items pages, Select all items on all pages),
     * the new selection object should be created.
     * @param {ISelection} currentSelection
     * @param {any[]} currentItems Items on current page
     * @param {SelectionType} selectorValue
     * @param {number} totalItems
     * @param trackBy
     * @param {boolean} virtualScroll Enables virtual scroll selection behavior
     * @returns {ISelection} New selection object
     */
    public applySelector(
        currentSelection: ISelection,
        currentItems: any[],
        selectorValue: SelectionType,
        totalItems: number,
        trackBy: TrackByFunction<any> = (i, d) => d,
        virtualScroll?: boolean
    ): ISelection {
        if (virtualScroll) {
            if (
                selectorValue === SelectionType.AllPages ||
                selectorValue === SelectionType.All
            ) {
                return new SelectionModel({ isAllPages: true });
            }
            return new SelectionModel();
        }

        if (selectorValue === SelectionType.AllPages) {
            return new SelectionModel({ isAllPages: true });
        }

        const trackedItems = currentItems.map((value, index) =>
            trackBy(index, value)
        );
        if (currentSelection.isAllPages) {
            if (selectorValue === SelectionType.All) {
                return new SelectionModel({
                    isAllPages: true,
                    exclude: _differenceWith(
                        currentSelection.exclude,
                        trackedItems,
                        _isEqual
                    ),
                });
            }

            if (selectorValue === SelectionType.UnselectAll) {
                return new SelectionModel({
                    isAllPages: true,
                    exclude: _unionWith(
                        currentSelection.exclude,
                        trackedItems,
                        _isEqual
                    ),
                });
            }
        } else {
            if (selectorValue === SelectionType.All) {
                return new SelectionModel({
                    include: _unionWith(
                        currentSelection.include,
                        trackedItems,
                        _isEqual
                    ),
                });
            }

            if (selectorValue === SelectionType.UnselectAll) {
                return new SelectionModel({
                    include: _differenceWith(
                        currentSelection.include,
                        trackedItems,
                        _isEqual
                    ),
                });
            }
        }

        return new SelectionModel();
    }

    /**
     * You may need to obtain the set of items that are selected given selection object and some set of items.
     * @param {ISelection} selection
     * @param {any[]} items
     * @returns {any[]} Set of items
     */
    public getSelectedItems(selection: ISelection, items: any[]): any[] {
        if (selection.isAllPages) {
            return _differenceWith(items, selection.exclude);
        } else {
            return _intersectionWith(items, selection.include);
        }
    }

    /**
     * Allows to react on changes of selected items (for selector).
     * If user selects some items directly in a list, selector state may change
     * @param {ISelection} currentSelection
     * @param {number} totalOnCurrentPage
     * @param {number} selectedOnCurrentPage
     * @param totalItems
     * @param selectedOnAllPages
     * @param {boolean} virtualScroll Enables virtual scroll selection behavior
     * @returns {ISelectorState}
     */
    public getSelectorState(
        currentSelection: ISelection,
        totalOnCurrentPage: number,
        selectedOnCurrentPage: number,
        totalItems?: number,
        selectedOnAllPages?: number,
        virtualScroll?: boolean
    ): ISelectorState {
        // Note: short cutting the flow in case we're preforming the selection in
        // virtual scroll mode where we can't have options for selection, just select all and unselect all
        if (virtualScroll) {
            // Note: In case user manually selected all the items we should set the Checked state
            if (selectedOnAllPages === totalItems) {
                return {
                    checkboxStatus: CheckboxStatus.Checked,
                    selectorItems: [],
                };
            }

            if (currentSelection.isAllPages) {
                return {
                    // Note: In case master checkbox is in the checked state we should ensure
                    // that we don't have any excluded items to prevent displaying Checked state
                    checkboxStatus: currentSelection.exclude.length
                        ? CheckboxStatus.Indeterminate
                        : CheckboxStatus.Checked,
                    selectorItems: [],
                };
            } else {
                return {
                    // Note: In case master checkbox is in the unchecked state we should ensure
                    // that we don't have any included items to prevent displaying Unchecked state
                    checkboxStatus: currentSelection.include.length
                        ? CheckboxStatus.Indeterminate
                        : CheckboxStatus.Unchecked,
                    selectorItems: [],
                };
            }
        }

        if (selectedOnCurrentPage === 0) {
            if (totalOnCurrentPage === totalItems) {
                return {
                    checkboxStatus: CheckboxStatus.Unchecked,
                    selectorItems: this.getFlatSelectorItems([
                        SelectionType.All,
                    ]),
                };
            }
            if (selectedOnAllPages && selectedOnAllPages > 0) {
                return {
                    checkboxStatus: CheckboxStatus.Unchecked,
                    selectorItems: this.getFlatSelectorItems([
                        SelectionType.All,
                        SelectionType.AllPages,
                        SelectionType.None,
                    ]),
                };
            }

            return {
                checkboxStatus: CheckboxStatus.Unchecked,
                selectorItems: this.getFlatSelectorItems([
                    SelectionType.AllPages,
                    SelectionType.All,
                ]),
            };
        }
        // case when we have only one page. Clarified with UX team that when we have one page we need to have SelectionType.All
        if (
            selectedOnCurrentPage < totalOnCurrentPage &&
            totalOnCurrentPage === totalItems
        ) {
            return {
                checkboxStatus: CheckboxStatus.Indeterminate,
                selectorItems: this.getFlatSelectorItems([
                    SelectionType.All,
                    SelectionType.None,
                ]),
            };
        }

        if (selectedOnCurrentPage === totalOnCurrentPage) {
            return {
                checkboxStatus: CheckboxStatus.Checked,
                selectorItems:
                    currentSelection.isAllPages &&
                    currentSelection.exclude.length === 0
                        ? this.getFlatSelectorItems([SelectionType.None])
                        : this.getFlatSelectorItems([
                              SelectionType.AllPages,
                              SelectionType.None,
                          ]),
            };
        }

        return {
            checkboxStatus: CheckboxStatus.Indeterminate,
            selectorItems: this.getFlatSelectorItems([
                SelectionType.All,
                SelectionType.AllPages,
                SelectionType.None,
            ]),
        };
    }

    /**
     * Allows to react on selection.
     * @param {ISelection} prevSelection Previous selection
     * @param {any[]} selectedItems Selected items on the current page
     * @param {any[]} items Items on the current page
     * @param {RepeatSelectionMode} selectionMode One of possible repeater selection modes
     * @param {number} totalItems Deprecated in v9 - Unused - Removal: NUI-5809
     * @returns {ISelection} New selection
     */
    public selectItems(
        prevSelection: ISelection,
        selectedItems: any[],
        items: any[],
        selectionMode: RepeatSelectionMode,
        totalItems?: number
    ): ISelection {
        if (!_isUndefined(totalItems)) {
            this.logger?.warn(
                "'totalItems' parameter of SelectorService.selectItems is unused and deprecated. As of Nova v9, this \
                argument may be omitted. Removal: NUI-5896"
            );
        }

        if (
            selectionMode === RepeatSelectionMode.radio ||
            selectionMode === RepeatSelectionMode.single ||
            selectionMode ===
                RepeatSelectionMode.radioWithNonRequiredSelection ||
            selectionMode === RepeatSelectionMode.singleWithRequiredSelection
        ) {
            return new SelectionModel({ include: selectedItems });
        }

        // This is just common sense: if selection mode can be dynamically changed this may be useful
        if (selectionMode === RepeatSelectionMode.none) {
            return new SelectionModel();
        }

        const includedItems = this.getIncludedItems(
            prevSelection,
            items,
            selectedItems
        );

        if (prevSelection.isAllPages) {
            return new SelectionModel({
                isAllPages: prevSelection.isAllPages,
                exclude: this.getExcludedItems(
                    prevSelection,
                    items,
                    selectedItems
                ),
            });
        }

        return new SelectionModel({
            isAllPages: prevSelection.isAllPages,
            include: includedItems,
        });
    }

    // items are all items in current repeater
    private getIncludedItems(
        prevSelection: ISelection,
        items: any[],
        selectedItems: any[]
    ): any[] {
        const unselectedItems = _differenceWith(items, selectedItems, _isEqual);
        const includedItems = _reject(prevSelection.include, (includedItem) =>
            unselectedItems.some((unselectedItem) =>
                _isEqual(includedItem, unselectedItem)
            )
        );
        return _unionWith(includedItems, selectedItems, _isEqual);
    }

    private getExcludedItems(
        prevSelection: ISelection,
        items: any[],
        selectedItems: any[]
    ): any[] {
        const excludedItems = _reject(prevSelection.exclude, (excludedItem) =>
            selectedItems.some((item) => _isEqual(excludedItem, item))
        );
        const unselectedItemsOnPage = _differenceWith(
            items,
            selectedItems,
            _isEqual
        );

        return unselectedItemsOnPage.reduce((memo, item) => {
            const isItemExcluded = excludedItems.some((excludedItem) =>
                _isEqual(excludedItem, item)
            );
            if (!isItemExcluded) {
                memo.push(item);
            }
            return memo;
        }, excludedItems);
    }

    private getFlatSelectorItems(arr: SelectionType[]): IMenuGroup[] {
        return [
            {
                itemsSource: arr.map((element: SelectionType) => ({
                    value: element,
                    title: this.i18nTitleMap[element],
                })),
            },
        ];
    }
}
