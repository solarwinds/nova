export interface ISelectChangedEvent<T> {
    oldValue: T;
    newValue: T;
}
export interface ISelectGroup {
    header?: string;
    items: any[];
}
