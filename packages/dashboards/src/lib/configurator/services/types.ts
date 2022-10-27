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

import { ComponentPortal } from "@angular/cdk/portal";
import { ComponentRef } from "@angular/core";
import { Observable } from "rxjs";

import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { IWidget } from "../../components/widget/types";
import { IPizzagna } from "../../types";

export interface IComponentPortalBundle<T> {
    portal: ComponentPortal<T>;
    attached?: (componentRef: ComponentRef<T>) => void;
}

export interface IConfiguratorSource {
    dashboardComponent: DashboardComponent;
    widget?: IWidget;
}

export interface IConfigurator<T = any> extends IConfiguratorSource {
    trySubmit?: WidgetUpdateOperation;
    portalBundle?: IComponentPortalBundle<T>;
}

export interface IWidgetSelector<T = any> extends IConfigurator<T> {
    widgetSelectionComponentType: Function;
}

export interface IWidgetEditor<T = any> extends IConfigurator<T> {
    formPizzagna: IPizzagna;
    paths: Record<string, string>;
}

export interface ISerializableTimeframe {
    startDatetime: string;
    endDatetime: string;
    selectedPresetId?: string;
    title?: string;
}

export type WidgetUpdateOperation = (
    widget: IWidget,
    source: IConfiguratorSource
) => Observable<IWidget>;
export type WidgetRemovalOperation = (
    widgetId: string,
    source: IConfiguratorSource
) => Observable<string>;
