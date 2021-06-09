import { ChangeDetectorRef, EventEmitter, InjectionToken, Injector, StaticProvider } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { EventBus } from "@nova-ui/bits";
import { GridsterItem } from "angular-gridster2";
import { Observable } from "rxjs";

import { LegendPlacement } from "./components/types";
import { IHeaderLinkProvider } from "./components/widget/widget-header/types";
import { IConfiguratorSource } from "./configurator/services/types";

/**
 * Same as Partial<T> but goes deeper and makes all of its properties and sub-properties Partial<T>.
 */
export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export const PIZZAGNA_EVENT_BUS = new InjectionToken<EventBus<Event>>("PIZZAGNA_EVENT_BUS");
export const DASHBOARD_EVENT_BUS = new InjectionToken<EventBus<Event>>("DASHBOARD_EVENT_BUS");
export const DATA_SOURCE = new InjectionToken<EventBus<Event>>("DATA_SOURCE");
export const FORMATTERS_REGISTRY = new InjectionToken<EventBus<Event>>("FORMATTERS_REGISTRY");
export const TEST_REGISTRY = new InjectionToken<EventBus<Event>>("TEST_REGISTRY");
export const HEADER_LINK_PROVIDER = new InjectionToken<EventBus<Event>>("HEADER_LINK_PROVIDER");

export type WidgetUpdateOperation = (widget: IWidget, source: IConfiguratorSource) => Observable<IWidget>;
export type WidgetRemovalOperation = (widgetId: string, source: IConfiguratorSource) => Observable<string>;

export interface IDashboardPersistenceHandler {
    trySubmit?: WidgetUpdateOperation;
    tryRemove?: WidgetRemovalOperation;
}

export enum WellKnownProviders {
    DataSource = "dataSource",
    Adapter = "adapter",
    Converter = "converter",
    Broadcaster = "broadcaster",
    Refresher = "refresher",
    EventProxy = "eventProxy",
    LoadingAdapter = "loadingAdapter",
    ContentFallbackAdapter = "contentFallbackAdapter",
    InteractionHandler = "interactionHandler",
    EventBusDebugger = "eventBusDebugger",
    KpiColorPrioritizer = "kpiColorPrioritizer",
    FormattersRegistry = "formattersRegistry",
    DataSourceManager = "dataSourceManager",
}

export enum WellKnownPathKey {
    Root = "root",
    DataSourceConfigComponentType = "dataSourceConfigComponentType",
    TileDescriptionConfigComponentType = "tileDescriptionConfigComponentType",
    DataSourceProviders = "dataSourceProviders",
    Formatters = "formatters",
    TileDescriptionBackgroundColors = "tileDescriptionBackgroundColors",
    TileBackgroundColorRulesBackgroundColors = "tileBackgroundColorRulesBackgroundColors",
}

export enum WellKnownDataSourceFeatures {
    Interactivity = "interactivity",
    DisableTableColumnGeneration = "disableTableColumnGeneration",
}

export interface IProperties extends Record<string, any> {
}

export interface IProviderProperties extends IProperties {
    /** This is property is set by the component portal directive to give providers self-awareness they need to update properties in pizzagna. */
    providerKey?: string;
}

export interface IComponentConfiguration {
    id: string;
    componentType: string;
    providers?: Record<string, IProviderConfiguration>;
    properties?: IProperties;
}

export interface IProviderConfiguration {
    providerId: string;
    properties?: IProviderProperties;
}

export interface IProviderConfigurationForDisplay extends IProviderConfiguration {
    label: string;
}

export interface IPortalEnvironment {
    providers?: StaticProvider[];
    injector?: Injector;
}

export interface IDashboard {
    widgets: IWidgets;
    positions: Record<string, GridsterItem>;
}

export interface IDashboardBelowFoldLazyLoadingConfig {
    enabled: boolean;
    configuration?: {
        // reloads widgets if they were already loaded but then disappeared from the view
        reloadWidgetsOnScroll: boolean;
    };
}

export interface IWidgets {
    [key: string]: IWidget;
}

export interface IPizzagnaLayer extends Record<string, DeepPartial<IComponentConfiguration>> {
}

export interface IPizzagna extends Record<string, IPizzagnaLayer> {
}

export interface IPizza extends Record<string, IComponentConfiguration> {
}

export interface IWidget {
    id: string;
    type: string;
    version?: number;
    pizzagna: IPizzagna;
    metadata?: IWidgetMetadata;
}

export interface IWidgetMetadata extends Record<string, any> {
    /**
     * Set this to true to communicate to the widget cloner that the widget requires
     * further configuration before it can be placed on the dashboard.
     */
    needsConfiguration?: boolean;
}

export interface IWidgetTypeDefinition {
    configurator?: IPizzagna;
    widget: IPizzagna;
    /**
     * Paths to various important values in pizzagnas - this should be coupled with respective pizzagnas in v10 - NUI-5829
     */
    paths?: {
        widget?: Record<string, string>;
        configurator?: Record<string, string>;
    };
}

/**
 * Interface for components that can be dynamically refreshed from the outside using the changeDetector
 */
export interface IHasChangeDetector {
    changeDetector: ChangeDetectorRef;
}

/**
 * Interface for components that expose a form
 */
export interface IHasForm<T extends AbstractControl = FormGroup> {
    form: T;
    formReady: EventEmitter<T>;
}

/**
 * Interface for providers that require the related component info
 */
export interface IHasComponent<T = any> {
    setComponent(component: T, componentId: string): void;
}

/**
 * Interface for configurable providers
 */
export interface IConfigurable {
    providerKey?: string;
    setComponent?: (component: any, componentId: string) => void;
    // TODO: BREAKING rename to 'updateProperties' in v12 - NUI-5828
    updateConfiguration(properties: IProperties): void;
}

export enum PizzagnaLayer {
    Structure = "structure",
    Configuration = "configuration",
    Data = "data",
}

export enum AccordionState {
    CRITICAL = "critical",
    WARNING = "warning",
    DEFAULT = "default",
}

export interface ILegendPlacementOption {
    id: LegendPlacement;
    label: string;
}

export enum HttpStatusCode {
    Unknown = "0",
    Ok = "200",
    Forbidden = "403",
    NotFound = "404",
}

/**
 * The properties for widget error display
 */
export interface IWidgetErrorDisplayProperties {
    image: string;
    title: string;
    description: string;
}

export interface IPaletteColor {
    color: string;
    label: string;
}

export type ComparatorFn = (a: any, b: any) => boolean;
export type ComparatorTypes = ">" | ">=" | "==" | "<" | "<=";
export interface IBackgroundColorComparator {
    comparatorFn: ComparatorFn;
    label?: string;
}
export interface IComparatorsDict extends Partial<Record<ComparatorTypes | string, IBackgroundColorComparator>> {}
