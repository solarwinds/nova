export interface IChipsItemsSource {
    flatItems?: IChipsItem[];
    groupedItems?: IChipsGroup[];
}

export interface IChipsItem {
    id?: string;
    label: string;
    customClass?: string | string[] | Set<string> | { [klass: string]: any };
}

export interface IChipsGroup {
    id?: string;
    label: string;
    items: IChipsItem[];
    customClass?: string | string[] | Set<string> | { [klass: string]: any };
}

export interface IChipRemoved {
    item: IChipsItem;
    group?: IChipsGroup;
}
