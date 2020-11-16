export interface ISortedItem {
    sortBy: any;
    direction: SorterDirection;
}

export interface ISorterChanges {
    newValue: ISortedItem;
    oldValue: ISortedItem;
}

export enum SorterDirection {
    ascending = "asc",
    descending = "desc",
    original = "original", // This means that sorting will not be applied
}
