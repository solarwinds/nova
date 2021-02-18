import { BehaviorSubject, Subject } from "rxjs";

import { IMenuGroup } from "../../lib/menu/public-api";
import { RepeatSelectionMode } from "../../lib/repeat/types";
import { CheckboxStatus, SelectionType } from "../../lib/selector/public-api";
import { SorterDirection } from "../../lib/sorter/public-api";
import { ISelection } from "../public-api";

export interface IFilterItem<T> {
    [key: string]: T;
}
export interface IFilterGroup<T> {
    [key: string]: T;
}
export interface IMultiFilterMetadata {
    allCategories: string[];
}
export interface IMultiFilter {
    [key: string]: IFilter<string[], IMultiFilterMetadata>;
}
export interface IFilteringOutputs {
    [key: string]: any;
}
export interface INovaFilteringOutputs extends IFilteringOutputs {
    repeat?: Repeat;
    paginator?: Paginator;
    selector?: Selector;
}
export interface Repeat {
    itemsSource: any[];
    selectedItems?: any[];
}
export interface Selector {
    selectorState?: ISelectorState;
    selection?: ISelection;
}
export interface Paginator {
    total: number;
    reset?: boolean;
}
export interface IFilterPub<F extends IFilters = IFilters> {
    onDestroy$?: Subject<void>;
    detectFilterChanges?: boolean;
    resetFilter?: () => void;
    getFilters: () => F;
}
export interface IFilters {
    [key: string]: any;
}
export interface INovaFilters extends IFilters {
    search?: IFilter<string>;
    paginator?: IFilter<IRange<number>>;
    sorter?: IFilter<ISorterFilter>;
    timerange?: IFilter<IRange<number>>;
    selection?: any;
    virtualScroll?: IFilter<IRange<number>>;
    [key: string]: IFilter<any> | undefined;
}
export interface IFilteringParticipant {
    componentInstance: IFilterPub;
}
export interface ISorterFilter {
    sortBy: string;
    direction: SorterDirection;
}
export interface IRepeatFilter {
    selection: any[];
    itemsSource: any[];
    selectionMode: RepeatSelectionMode;
    selectionHasChanged: boolean;
}
export interface ISelectorFilter {
    selectorState: ISelectorState;
    status: SelectionType;
}
export interface ISelectorState {
    checkboxStatus: CheckboxStatus;
    selectorItems: IMenuGroup[];
}
export interface IFilter<T, E = any> extends IFilters {
    type: string;
    value: T;
    metadata?: E;
}
export interface IRange<T> {
    start: T;
    end: T;
}
export interface IFilteringParticipants {
    [key: string]: IFilteringParticipant;
}
export const defaultFilters: INovaFilters = {
    search: {
        type: "string",
        value: "",
    },
    sorter: {
        type: "sorter",
        value: {
            sortBy: "",
            direction: SorterDirection.original,
        },
    },
    paginator: {
        type: "range",
        value: {
            start: 0,
            end: 5,
        },
    },
};

export interface IDataSourceError {
    type: string | number;
}

export interface IDataSourceOutput<T> {
    result: T;
    error?: IDataSourceError;
}

export interface IDataSource<T extends IFilteringOutputs = IFilteringOutputs> {
    outputsSubject: Subject<any | IDataSourceOutput<T>>;
    busy?: Subject<boolean>;
    features?: IDataSourceFeaturesConfiguration;
    dataFieldsConfig?: IDataFieldsConfig;
    applyFilters(): Promise<void>;
    registerComponent(components: Partial<IFilteringParticipants>): void;
    deregisterComponent?(componentKey: string): void;
}

export interface IDataSourceFeaturesConfiguration {
    featuresChanged: Subject<IDataSourceFeatures>;
    getSupportedFeatures: () => IDataSourceFeatures | undefined;
    setSupportedFeatures: (features: IDataSourceFeatures) => void;
    getFeatureConfig: (key: string) => IDataSourceFeature | undefined; // should it be?
}

export interface IDataSourceFeatures {
    search?: IDataSourceFeature;
    sorting?: IDataSourceFeature;
    pagination?: IDataSourceFeature;
    [key: string]: IDataSourceFeature | undefined;
}

export interface IDataSourceFeature {
    enabled: boolean;
    metadata?: {
        [key: string]: any;
    };
}

export interface IDataSourceDrilldown extends IDataSource {
    busy?: BehaviorSubject<boolean>;
}

export interface IDataFieldsConfig {
    dataFields$: BehaviorSubject<IDataField[]>;
}

// TODO: mark dataType field as optional in vNext, because previously it was used only for TableWidget,
//  but IDataField is using in DataSource now so that consumers are required to fill these fields - will be done in the scope of NUI-5836
export interface IDataField {
    id: string;
    label: string;
    dataType: string;
    sortable?: boolean;
}

