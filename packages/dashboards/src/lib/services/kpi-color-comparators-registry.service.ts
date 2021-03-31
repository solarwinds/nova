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
