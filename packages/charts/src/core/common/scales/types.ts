import { AxisScale } from "d3-axis";

import { IAccessors, IChartSeries } from "../types";

/** Domain for series with empty or null data */
export const EMPTY_CONTINUOUS_DOMAIN = [0, 0];
/** A reasonable non-data-driven domain for charts  */
export const NORMALIZED_DOMAIN = [0, 1];

/** Signature for domain calculator */
export type DomainCalculator = (
    chartSeriesSet: IChartSeries<IAccessors>[],
    scaleId: string,
    scale: IScale<any>
) => any[];

/** Signature for a specific domain calculator that rounds domain to the closes tick */
export interface IDomainWithTicksCalculator extends DomainCalculator {
    domainWithTicks?: true;
}

/** Type guard for the domain calculator with ticks */
export function isDomainWithTicksCalculator(
    obj: any
): obj is IDomainWithTicksCalculator {
    return !!obj.domainWithTicks;
}

/** Interface for scale formatters */
export interface IFormatters<T> {
    /** Formatter for tick labels */
    tick?: Formatter<T>;
    /** Additional formatters */
    [p: string]: Formatter<T> | undefined;
}

/** Signature for label formatters */
export type Formatter<T> = (value: T) => string;

/** Dictionary of scale collections in index and array form */
export interface ScalesIndex {
    [key: string]: {
        /** Scale collection as an index */
        index: { [scaleId: string]: IScale<any> };
        /** Scale collection as an array */
        list: IScale<any>[];
    };
}

/** Dictionary of scales */
export type Scales = Record<string, IScale<any>>;

export interface IXYScales extends Scales {
    x: IScale<any>;
    y: IScale<any>;
}

export interface IRadialScales extends Scales {
    r: IScale<number>;
}

/** Interface for a scale */
export interface IScale<T> {
    /** The scale identifier */
    readonly id: string;
    readonly d3Scale: AxisScale<T>; // TODO: maybe AxisScale is to narrow?

    /** If this flag is enabled, the domain of this scale is not recalculated */
    isDomainFixed?: boolean;
    /** Method used to calculate the scale's domain */
    domainCalculator?: DomainCalculator;
    /** The scales formatters */
    formatters: IFormatters<T>;
    /** If this flag is enabled, the domain has been recalculated with ticks in mind */
    __domainCalculatedWithTicks?: boolean;

    /**
     * Determines if the scale's domain is continuous
     *
     * @returns {boolean} true if the scale's domain is continuous (numeric), false otherwise
     */
    isContinuous(): boolean;

    /**
     * Determines if the scale's domain is valid
     *
     * @returns {boolean} true if the scale's domain is valid, false otherwise
     */
    isDomainValid(): boolean;

    /**
     * Converts a value to its corresponding coordinate
     *
     * @param {T} value The value to be converted
     * @returns {number} The coordinate corresponding to the specified value
     */
    convert(value: T): number;

    /**
     * Converts a coordinate to its corresponding value
     *
     * @param {number} coordinate The coordinate to be converted
     * @returns {T} The value corresponding to the specified coordinate
     */
    invert(coordinate: number): T | undefined;

    /**
     * Gets the scale's range
     *
     * @returns {[number, number]} The scale's range
     */
    range(): [number, number];

    /**
     * Sets the scale's range
     *
     * @param {[number, number]} range The scale's new range
     */
    range(range: [number, number]): this;

    /**
     * Gets the scale's domain
     *
     * @returns {T[]} The scale's domain
     */
    domain(): T[];

    /**
     * Sets the scale's domain
     *
     * @param {T[]} domain The scale's new domain
     */
    domain(domain: T[]): this;

    /**
     * Shorthand method for setting the domain and isDomainFixed at once
     *
     * @param {T[]} domain The scale's fixed domain
     */
    fixDomain(domain: T[]): void;

    /**
     * Reverse the scale orientation by toggling the reversed flag
     */
    reverse(): this;

    /**
     * Getter for the reversed flag (see #reverse)
     */
    reversed(): boolean;

    /**
     * Setter for the reversed flag (see #reverse)
     *
     * @param reversed
     */
    reversed(reversed: boolean): this;
}

export interface IBandScale<T> extends IScale<T> {
    bandwidth(): number;
}

export function isBandScale(scale: any): scale is IBandScale<any> {
    return typeof scale.bandwidth === "function";
}

export interface IHasInnerScale<T> extends IScale<T> {
    innerScale: IScale<any>;
}

export function hasInnerScale(scale: any): scale is IHasInnerScale<any> {
    return typeof scale.innerScale !== "undefined";
}
