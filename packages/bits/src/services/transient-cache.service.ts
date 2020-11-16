import { Injectable } from "@angular/core";
import { timer } from "rxjs";
import { map } from "rxjs/operators";

import { ITransientCache } from "./public-api";
import { UtilService } from "./util.service";

interface ICache {
    [key: string]: any;
}

/** @ignore */
@Injectable({providedIn: "root"})
export class TransientCacheService implements ITransientCache {
    private cache: ICache = {};

    constructor(private utilService: UtilService) {
    }

    public put = async (key: string, value: any, lifetime: number): Promise<void> => {
        if (typeof key === "undefined" || key === null) {
            return Promise.reject("no key");
        }
        if (typeof value === "undefined" || value === null) {
            return Promise.reject("no value");
        }
        this.cache[key] = value;

        return timer(lifetime)
            .pipe(
                map(() => {
                    this.remove(key);
                }))
            .toPromise();
    }

    public remove = (key: string): void => {
        delete this.cache[key];
    }

    public get = (key: string): any =>
        this.cache[key]

    public removeAll = (): void => {
        for (const key in this.cache) {
            if (this.cache.hasOwnProperty(key)) {
                this.remove(key);
            }
        }
    }

    public destroy = (): void => {
        this.removeAll();
    }

    public entryCount = (): number =>
        Object.keys(this.cache).length

    public size = (): number => {
        let byteCount = 0;

        for (const key in this.cache) {
            if (this.cache.hasOwnProperty(key)) {
                byteCount += this.utilService.sizeof(key)
                    + this.utilService.sizeof(this.get(key));
            }
        }

        return byteCount;
    }
}
