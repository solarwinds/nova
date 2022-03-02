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

export interface IRepeatItemConfig<T = IRepeatItem> {
    isDisabled?: (params: T) => boolean;
    isDraggable?: (params: T) => boolean;
    trackBy?: TrackByFunction<T>;
}
