import { Subject, Subscription } from "rxjs";

import { NotificationHandler } from "./notification-service";

export * from "./data-source/public-api";

export interface IEventPropagationService {
    targetShouldPropagate(event: Event): boolean;
}

export { NuiActiveDialog } from "../lib/dialog/dialog-ref";

export interface IEdgeDetectionResult {
    placed: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
    aligned: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
}

export interface IEdgeDetectionCoordinates {
    left: number;
    top: number;
}

export interface IEdgeDetectionProperties {
    position: IEdgeDetectionCoordinates;
    height: number;
}
export interface IEdgeDetectionService {
    canBe(
        basePointElement: Element,
        placedElement: Element
    ): IEdgeDetectionResult;
}

export interface IEdgeDefinerMeasurements {
    position: IEdgeDetectionCoordinates;
    width: number;
    height: number;
    scrollY: number;
    scrollX: number;
}

export interface ISearchService {
    search(
        items: any[],
        properties: string[],
        searchValue: any,
        dateFormat?: string
    ): any[];
}

export interface INotificationService {
    subscribe(channel: string, handler: NotificationHandler): Subscription;
    post(channel: string, args: any): void;
}

/** @ignore */
export interface ITransientCache {
    put: (key: string, value: any, lifetime: number) => Promise<void>;
    get: (key: string) => any;
    remove: (key: string) => void;
    removeAll: () => void;
    destroy: () => void;
    entryCount: () => number;
    size: () => number;
}

/**
 * The result of a unit conversion returned by the UnitConversionService's convert method
 */
export interface IUnitConversionResult {
    /** Serves as an index into the exported 'unitConversionConstants' for determining which unit string display value to use. */
    order: number;
    /** The converted value as a string */
    value: string;
    /** The converted value in exponential form */
    scientificNotation: string;
    /** The maximum number of significant digits to display to the right of the decimal */
    scale?: number;
}

export interface ISelection {
    exclude: any[];
    include: any[];
    isAllPages: Boolean;
}

export class SelectionModel implements ISelection {
    public exclude: any[] = [];
    public include: any[] = [];
    public isAllPages: Boolean = false;

    constructor(selection: Partial<ISelection> = {}) {
        Object.assign(this, selection);
    }
}

export class IEvent<T = any> {
    id?: string;
    payload?: T;
}

export interface IEventDefinition<T = any> {
    id: string;
    subjectFactory?: () => Subject<T>;
}

export class EventDefinition<T> implements IEventDefinition<IEvent<T>> {
    constructor(
        public id: string,
        public subjectFactory?: () => Subject<IEvent<T>>
    ) {}

    public toString() {
        return this.id;
    }
}

export interface IVirtualPageConfig {
    /**
     * The required property that should be passed on initialization.
     * IMPORTANT: It should be equal to pageSize requested from the server.
     */
    pageSize: number;
    /**
     * Set this boolean to false if the first batch of data will be loaded/requested
     * externally by a different entity (ex. search, sort, etc.).
     * When true, VirtualViewportManager will request/emit the first page range event automatically.
     */
    emitFirstPage?: boolean;
}

/**
 * VirtualViewportManager reset configuration options
 */
export interface IVirtualViewportResetOptions
    extends Required<Pick<IVirtualPageConfig, "emitFirstPage">> {
    /**
     * Set this boolean to false if the first batch of data will be loaded/requested
     * externally by a different entity (ex. search, sort, etc.).
     * When true, VirtualViewportManager will request/emit the first page range event automatically.
     * Default: true
     */
    emitFirstPage: boolean;
}
