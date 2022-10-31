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

import { Injectable } from "@angular/core";

import { IComparatorsDict } from "../types";

export const DEFAULT_COMPARATORS: IComparatorsDict = {
    ">": {
        comparatorFn: (a: any, b: any) => a > b,
        label: "Value is greater than",
    },
    "<": {
        comparatorFn: (a: any, b: any) => a < b,
        label: "Value is less than",
    },
    ">=": {
        comparatorFn: (a: any, b: any) => a >= b,
        label: "Value is greater, or equal to",
    },
    "<=": {
        comparatorFn: (a: any, b: any) => a <= b,
        label: "Value is less than, or equal to",
    },
    "==": {
        // eslint-disable-next-line eqeqeq
        comparatorFn: (a: any, b: any) => a == b,
        label: "Value is exactly",
    },
};

@Injectable({ providedIn: "root" })
export class KpiColorComparatorsRegistryService {
    protected comparators: IComparatorsDict;

    constructor() {
        this.comparators = { ...DEFAULT_COMPARATORS };
    }

    public registerComparators(comparators: IComparatorsDict): void {
        this.comparators = {
            ...this.comparators,
            ...comparators,
        };
    }

    public clearComparators(): void {
        this.comparators = {};
    }

    public getComparators(): IComparatorsDict {
        return this.comparators;
    }
}
