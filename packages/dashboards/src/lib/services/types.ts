import { StaticProvider } from "@angular/core";
import { EventDefinition, IEvent, IEventDefinition } from "@nova-ui/bits";
import { BehaviorSubject, ReplaySubject } from "rxjs";

import { IDataSourceBusyPayload } from "../components/providers/types";

export const DEFAULT_PIZZAGNA_ROOT = "/";

export interface IStaticProviders {
    [providerId: string]: StaticProvider;
}

export interface ISetPropertyPayload {
    path: string;
    value: any;
}

export interface IPreviewEventPayload {
    id: IEventDefinition;
    payload: any;
}

export interface IRegistryAddOptions {
    overrideExisting: boolean;
}
export interface IAddFormattersOptions extends Pick<IRegistryAddOptions, "overrideExisting"> {}

export const REFRESH = new EventDefinition("REFRESH");
export const SCROLL_NEXT_PAGE = new EventDefinition("SCROLL_NEXT_PAGE");
export const WIDGET_REMOVE = new EventDefinition("WIDGET_REMOVE");
export const WIDGET_EDIT = new EventDefinition("WIDGET_EDIT");
export const WIDGET_CREATE = new EventDefinition("WIDGET_CREATE");
export const WIDGET_READY = new EventDefinition("WIDGET_READY");
export const WIDGET_RESIZE = new EventDefinition("WIDGET_RESIZE");
export const WIDGET_POSITION_CHANGE = new EventDefinition("WIDGET_POSITION_CHANGE");
export const WIDGET_SEARCH = new EventDefinition("WIDGET_SEARCH", () => new BehaviorSubject<IEvent>({ payload: "" }));
export const SET_PROPERTY_VALUE = new EventDefinition("SET_PROPERTY_VALUE");
export const SET_TIMEFRAME = new EventDefinition("SET_TIMEFRAME");
export const PREVIEW_EVENT = new EventDefinition("PREVIEW_EVENT");
export const DATA_SOURCE_BUSY = new EventDefinition<IDataSourceBusyPayload>("DATA_SOURCE_BUSY");
export const DASHBOARD_EDIT_MODE = new EventDefinition("DASHBOARD_EDIT_MODE", () => new ReplaySubject<IEvent>(1));
export const INTERACTION = new EventDefinition("INTERACTION");
export const DATA_SOURCE_INVOKED = new EventDefinition("DATA_SOURCE_INVOKED");
export const DRILLDOWN = new EventDefinition("DRILLDOWN");

export const NOVA_DATASOURCE_INTERVAL_REFRESHER = "NOVA_DATASOURCE_INTERVAL_REFRESHER";
export const NOVA_DATASOURCE_ADAPTER = "NOVA_DATASOURCE_ADAPTER";
export const NOVA_TIMESERIES_DATASOURCE_ADAPTER = "NOVA_TIMESERIES_DATASOURCE_ADAPTER";
export const NOVA_KPI_DATASOURCE_ADAPTER = "NOVA_KPI_DATASOURCE_ADAPTER";
export const NOVA_DRILLDOWN_DATASOURCE_ADAPTER = "NOVA_DRILLDOWN_DATASOURCE_ADAPTER";
export const NOVA_KPI_COLOR_PRIORITIZER = "NOVA_KPI_COLOR_PRIORITIZER";
export const NOVA_TITLE_AND_DESCRIPTION_CONVERTER = "NOVA_TITLE_AND_DESCRIPTION_CONVERTER";
export const NOVA_PROPORTIONAL_WIDGET_CHART_OPTIONS_CONVERTER = "NOVA_PROPORTIONAL_WIDGET_CHART_OPTIONS_CONVERTER";
export const NOVA_KPI_TILES_CONVERTER = "NOVA_KPI_TILES_CONVERTER";
export const NOVA_TIMESERIES_METADATA_CONVERTER = "NOVA_TIMESERIES_METADATA_CONVERTER";
export const NOVA_TIMESERIES_SERIES_CONVERTER = "NOVA_TIMESERIES_SERIES_CONVERTER";
export const NOVA_DASHBOARD_EVENT_PROXY = "NOVA_DASHBOARD_EVENT_PROXY";
export const NOVA_TABLE_COLUMNS_CONVERTER = "NOVA_TABLE_COLUMNS_CONVERTER";
export const NOVA_TABLE_FILTERS_CONVERTER = "NOVA_TABLE_FILTERS_CONVERTER";
export const NOVA_TABLE_DATASOURCE_ADAPTER = "NOVA_TABLE_DATASOURCE_ADAPTER";
export const NOVA_GENERIC_CONVERTER = "NOVA_GENERIC_CONVERTER";
export const NOVA_GENERIC_ARRAY_CONVERTER = "NOVA_GENERIC_ARRAY_CONVERTER";
export const NOVA_KPI_SECTION_CONVERTER = "NOVA_KPI_SECTION_CONVERTER";
export const NOVA_TIMESERIES_TILE_INDICATOR_DATA_CONVERTER = "NOVA_TIMESERIES_TILE_INDICATOR_DATA_CONVERTER";
export const NOVA_LOADING_ADAPTER = "NOVA_LOADING_ADAPTER";
export const NOVA_STATUS_CONTENT_FALLBACK_ADAPTER = "NOVA_STATUS_CONTENT_FALLBACK_ADAPTER";
export const NOVA_KPI_STATUS_CONTENT_FALLBACK_ADAPTER = "NOVA_KPI_STATUS_CONTENT_FALLBACK_ADAPTER";
export const NOVA_KPI_SCALE_SYNC_BROKER = "NOVA_KPI_SCALE_SYNC_BROKER";
export const NOVA_URL_INTERACTION_HANDLER = "NOVA_URL_INTERACTION_HANDLER";
export const NOVA_EVENT_BUS_DEBUGGER = "NOVA_EVENT_BUS_DEBUGGER";
export const NOVA_PIZZAGNA_BROADCASTER = "NOVA_PIZZAGNA_BROADCASTER";
export const NOVA_VIRTUAL_VIEWPORT_MANAGER = "NOVA_VIRTUAL_VIEWPORT_MANAGER";
export const NOVA_TABLE_FORMATTERS_REGISTRY = "NOVA_TABLE_FORMATTERS_REGISTRY";
export const NOVA_KPI_FORMATTERS_REGISTRY = "NOVA_KPI_FORMATTERS_REGISTRY";
export const NOVA_PROPORTIONAL_CONTENT_FORMATTERS_REGISTRY = "NOVA_PROPORTIONAL_CONTENT_FORMATTERS_REGISTRY";
export const NOVA_TEST_REGISTRY = "NOVA_TEST_REGISTRY";
