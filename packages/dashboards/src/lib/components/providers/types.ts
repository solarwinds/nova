import { BehaviorSubject } from "rxjs";

import { ComparatorTypes, IProperties } from "../../types";
import { ITimeseriesWidgetSeries } from "../timeseries-widget/types";
import { IFormatter } from "../types";

/** Default refresh interval in seconds */
export const DEFAULT_REFRESH_INTERVAL = 300;

export interface ITimeseriesDataSourceAdapterConfiguration extends IProperties {
    series: ITimeseriesWidgetSeries[];
}

export interface IDataSourceOutput<T> {
    result: T;
    error?: IDataSourceError;
}

export interface IComponentIdPayload {
    componentId: string;
}

export interface IDataSourceOutputPayload<T> extends IDataSourceOutput<T>, IComponentIdPayload {
}

export interface IDataSourceBusyPayload extends IComponentIdPayload {
    busy: boolean;
}

export interface IDataSourceError {
    type: string | number;
    message?: string;
}


export type BroadcasterTrackOnType = "component" | "pizzagna";

export interface IBroadcasterConfig {
    trackOn?: BroadcasterTrackOnType;
    key: string;
    paths: string[];
}


export interface IKpiColorRules {
    comparisonType: ComparatorTypes;
    value: any;
    color: any;
}

export interface IDrilldownComponentConfiguration extends IFormatter {
    properties: Record<string, any>;
    itemProperties?: IProperties;
}

export interface IDrilldownComponentsConfiguration {
    group: IDrilldownComponentConfiguration;
    leaf: IDrilldownComponentConfiguration;
}

export interface IBrokerValue {
    id: string;
    targetID: string;
    targetValue: number;
}

export interface IBrokerUserConfig {
    id: string;
    type?: "min" | "max";
}

export interface IBroker extends IBrokerUserConfig {
    in$: BehaviorSubject<IBrokerValue>;
    out$: BehaviorSubject<IBrokerValue>;
}
