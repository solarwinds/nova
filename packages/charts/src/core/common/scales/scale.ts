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

import { AxisScale } from "d3-axis";
import { UnitOption } from "@nova-ui/bits";

import { UtilityService } from "../utility.service";
import { getAutomaticDomain } from "./domain-calculation/automatic-domain";
import { DomainCalculator, IFormatters, IScale } from "./types";

export abstract class Scale<T> implements IScale<T> {
    public readonly id: string;
    public domainCalculator: DomainCalculator = getAutomaticDomain;
    public formatters: IFormatters<T> = {};
    public isDomainFixed: boolean;
    public scaleUnits?: UnitOption;
    public isTimeseriesScale = false;
    private isReversed = false;

    protected _fixDomainValues: T[] = [];
    protected readonly _d3Scale: any;

    protected constructor(id?: string) {
        this.id = id || UtilityService.uuid();

        this._d3Scale = this.createD3Scale();
    }

    /**
     * Creates a d3 scale based on the scale's type
     *
     * @returns {any} A new d3 scale appropriate to the scale type
     */
    protected abstract createD3Scale(): any;

    public abstract convert(value: T): number;

    public abstract invert(coordinate: number): T | undefined;

    public abstract isContinuous(): boolean;

    /** See {@link IScale#d3Scale} */
    public get d3Scale(): AxisScale<T> {
        return this._d3Scale;
    }

    public get fixDomainValues(): T[] {
        return this._fixDomainValues;
    }

    /** See {@link IScale#setFixDomainValues} */
    public setFixDomainValues(values: T[]): void {
        if (values.length > 1) {
            this.domain([values[0], values[values.length - 1]]);
            this.isDomainFixed = true;
        }
        this._fixDomainValues = values;
    }

    /** See {@link IScale#range} */
    public range(): [number, number];
    public range(range: [number, number]): this;
    public range(range?: [number, number]): any {
        if (range) {
            this._d3Scale.range(this.isReversed ? range.reverse() : range);
            return this;
        } else {
            return this._d3Scale.range();
        }
    }

    /** See {@link IScale#domain} */
    public domain(): T[];
    public domain(domain: T[]): this;
    public domain(domain?: T[]): any {
        if (domain) {
            this._d3Scale.domain(domain);
            return this;
        } else {
            return this._d3Scale.domain();
        }
    }

    /** See {@link IScale#fixDomain} */
    public fixDomain(domain: T[]): this {
        this.domain(domain);
        this.isDomainFixed = true;
        return this;
    }

    /** See {@link IScale#reverse} */
    public isDomainValid(): boolean {
        return -1 === this.domain().findIndex((value) => value === undefined);
    }

    public reverse(): this {
        return this.reversed(!this.isReversed);
    }

    /** See {@link IScale#reversed} */
    public reversed(): boolean;
    public reversed(reversed: boolean): this;
    public reversed(reversed?: boolean): boolean | this {
        if (typeof reversed === "undefined") {
            return this.isReversed;
        } else {
            this.isReversed = reversed;
            return this;
        }
    }
}
