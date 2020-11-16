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
