import { ChangeDetectorRef, EventEmitter, InjectionToken, Injector, StaticProvider } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { EventBus } from "@nova-ui/bits";

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

export interface IPizzagnaLayer extends Record<string, DeepPartial<IComponentConfiguration>> {
}

export interface IPizzagna extends Record<string, IPizzagnaLayer> {
}

export interface IPizza extends Record<string, IComponentConfiguration> {
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

export enum HttpStatusCode {
    Unknown = "0",
    Ok = "200",
    Forbidden = "403",
    NotFound = "404",
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
