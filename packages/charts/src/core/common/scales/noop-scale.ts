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

import { IFormatters, IScale } from "./types";

export class NoopScale<T = string> implements IScale<T> {
    public readonly id: string;
    public formatters: IFormatters<T>;
    public isDomainFixed: boolean;

    constructor(id?: string) {}

    public convert(): number {
        // @ts-ignore
        return;
    }

    public invert(): T {
        // @ts-ignore
        return;
    }

    public get d3Scale(): AxisScale<T> {
        // @ts-ignore
        return;
    }

    range(): [number, number];
    range(range: [number, number]): this;
    range(range?: [number, number]): [number, number] | this {
        // @ts-ignore
        return;
    }

    domain(): T[];
    domain(domain: T[]): this;
    domain(domain?: T[]): any {
        // @ts-ignore
        return;
    }

    public fixDomain(domain: any[]): null {
        return null;
    }

    public isContinuous(): boolean {
        return false;
    }

    public isDomainValid(): boolean {
        return true;
    }

    public reverse(): this {
        // @ts-ignore
        return;
    }

    public reversed(): boolean;
    public reversed(reversed: boolean): this;
    public reversed(reversed?: boolean): boolean | this {
        // @ts-ignore
        return;
    }
}
