import { ComponentPortal } from "@angular/cdk/portal";
import { ComponentRef } from "@angular/core";

import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { IPizzagna } from "../../types";
import { IWidget } from "../../components/widget/types";
import { Observable } from "rxjs";

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

export type WidgetUpdateOperation = (widget: IWidget, source: IConfiguratorSource) => Observable<IWidget>;
export type WidgetRemovalOperation = (widgetId: string, source: IConfiguratorSource) => Observable<string>;
