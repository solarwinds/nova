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

export interface IDataSourceOutputPayload<T>
    extends IDataSourceOutput<T>,
        IComponentIdPayload {}

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
