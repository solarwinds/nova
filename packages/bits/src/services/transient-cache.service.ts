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

import { Injectable, inject } from "@angular/core";
import { timer } from "rxjs";
import { map } from "rxjs/operators";

import { ITransientCache } from "./public-api";
import { UtilService } from "./util.service";

interface ICache {
    [key: string]: any;
}

/** @ignore */
@Injectable({ providedIn: "root" })
export class TransientCacheService implements ITransientCache {
    private utilService = inject(UtilService);

    private cache: ICache = {};

    public put = async (
        key: string,
        value: any,
        lifetime: number
    ): Promise<void> => {
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
                })
            )
            .toPromise();
    };

    public remove = (key: string): void => {
        delete this.cache[key];
    };

    public get = (key: string): any => this.cache[key];

    public removeAll = (): void => {
        for (const key in this.cache) {
            if (this.cache.hasOwnProperty(key)) {
                this.remove(key);
            }
        }
    };

    public destroy = (): void => {
        this.removeAll();
    };

    public entryCount = (): number => Object.keys(this.cache).length;

    public size = (): number => {
        let byteCount = 0;

        for (const key in this.cache) {
            if (this.cache.hasOwnProperty(key)) {
                byteCount +=
                    this.utilService.sizeof(key) +
                    this.utilService.sizeof(this.get(key));
            }
        }

        return byteCount;
    };
}
