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

import { RepeatSelectionMode } from "../lib/repeat/types";
import { SelectionType } from "../lib/selector/public-api";
import { SelectorService } from "../lib/selector/selector.service";
import { INovaFilteringOutputs } from "./data-source/public-api";
import { SelectionModel } from "./public-api";

@Injectable({ providedIn: "root" })
export class ListService {
    constructor(private selectorService: SelectorService) {}

    /**
     * Updates the selector checkbox status, selector menu items, and the repeat selected items.
     *
     * @param {INovaFilteringOutputs} state The filtering outputs state
     *
     * @returns {INovaFilteringOutputs} The updated state
     */
    public updateSelectionState(
        state: INovaFilteringOutputs
    ): INovaFilteringOutputs {
        const selection = new SelectionModel(state.selector?.selection ?? {});
        const itemsSource = (state.repeat && state.repeat.itemsSource) || [];
        const paginator = state.paginator || { total: undefined };

        const selectedItems = this.selectorService.getSelectedItems(
            selection,
            itemsSource
        );
        const outputState = {
            ...state,
            repeat: {
                itemsSource,
                ...state.repeat,
                selectedItems,
            },
            selector: {
                ...state.selector,
                selection,
                selectorState: this.selectorService.getSelectorState(
                    selection,
                    itemsSource.length,
                    selectedItems.length,
                    paginator.total,
                    selection.include.length
                ),
            },
        };

        return outputState;
    }

    /**
     * Updates the selector selection state, selector checkbox status, selector menu items, and the
     * selected items in the repeat based on the items in the provided list and the specified selection
     * mode.
     *
     * @param {any[]} selectedItems The items to select
     * @param {RepeatSelectionMode} selectionMode The mode to use for selection
     * @param {INovaFilteringOutputs} state The filtering outputs state
     *
     * @returns {INovaFilteringOutputs} The updated state
     */
    public selectItems(
        selectedItems: any[],
        selectionMode: RepeatSelectionMode,
        state: INovaFilteringOutputs
    ): INovaFilteringOutputs {
        if (!state.selector || !state.selector.selection) {
            throw new Error("State must contain selector property");
        }

        if (!state.repeat) {
            throw new Error("State must contain repeat property");
        }

        if (!state.paginator) {
            throw new Error("State must contain paginator property");
        }

        const outputState = {
            ...state,
            selector: {
                ...state.selector,
                selection: this.selectorService.selectItems(
                    state.selector.selection,
                    selectedItems,
                    state.repeat.itemsSource,
                    selectionMode
                ),
            },
        };

        return this.updateSelectionState(outputState);
    }

    /**
     * Updates the selector selection state, selector checkbox status, selector menu items, and the
     * selected items in the repeat based on the selection type.
     *
     * @param {SelectionType} selectionType The selection type to apply
     * @param {INovaFilteringOutputs} state The filtering outputs state
     *
     * @returns {INovaFilteringOutputs} The updated state
     */
    public applySelector(
        selectionType: SelectionType,
        state: INovaFilteringOutputs
    ): INovaFilteringOutputs {
        if (!state.selector || !state.selector.selection) {
            throw new Error("State must contain selector property");
        }

        if (!state.repeat) {
            throw new Error("State must contain repeat property");
        }

        if (!state.paginator) {
            throw new Error("State must contain paginator property");
        }

        const outputState = {
            ...state,
            selector: {
                ...state.selector,
                selection: this.selectorService.applySelector(
                    state.selector.selection,
                    state.repeat.itemsSource,
                    selectionType,
                    state.paginator.total
                ),
            },
        };

        return this.updateSelectionState(outputState);
    }
}
