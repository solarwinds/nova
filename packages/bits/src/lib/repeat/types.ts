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

import { CdkDrag, DropListRef } from "@angular/cdk/drag-drop";
import { TrackByFunction } from "@angular/core";

export enum RepeatSelectionMode {
    multi = "multi",
    single = "single",
    singleWithRequiredSelection = "singleWithRequiredSelection",
    radio = "radio",
    radioWithNonRequiredSelection = "radioWithNonRequiredSelection",
    none = "none",
}

export enum PaddingOptions {
    normal = "normal",
    compact = "compact",
}

export interface IItemsReorderedEvent<T = IRepeatItem> {
    previousIndex: number;
    currentIndex: number;
    item: CdkDrag<T>;
    previousState: T[];
    currentState: T[];
    dropListRef: DropListRef;
}

export interface ITypedRepeatItem {
    disabled?: boolean;
}

export type IRepeatItem = ITypedRepeatItem | any;

export interface IRepeatItemConfig<T extends IRepeatItem = IRepeatItem> {
    isDisabled?: (params: T) => boolean;
    isDraggable?: (params: T) => boolean;
    trackBy?: TrackByFunction<T>;
}
