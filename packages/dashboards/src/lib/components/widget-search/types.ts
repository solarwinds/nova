export interface ISearchOnKeyUp {
    enabled: boolean;
    debounceTime?: number;
}

export interface IWidgetSearchConfiguration {
    searchOnKeyUp?: ISearchOnKeyUp;
}
