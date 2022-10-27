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
import size from "lodash/size";

import { ITransientCache } from "./public-api";
import { TransientCacheService } from "./transient-cache.service";
import { UtilService } from "./util.service";

export interface IMap<T> {
    [key: string]: T;
}

/** @ignore */
@Injectable()
export class TransientCacheFactory {
    private cacheMap: IMap<ITransientCache> = {};

    constructor(private utilService: UtilService) {}

    /** @ngdoc method
     *  @name create
     *  @methodOf nui.services:TransientCacheFactory
     *  @description returns a newly created ITransientCache object for use.
     *  @param {string} cacheId unique identifier of the cache
     *  @returns {ITransientCache} newly created ITransientCache object.
     *
     * {@link https://github.com/solarwinds/nova/blob/main/packages/bits/src/services/public-api.ts ITransientCache} interface
     *
     *      put(key:string, value:any, lifetime:number) => IPromise<void> -
     *          Puts a new key-value pair into the cache with the lifetime specified and returns it.
     *      get(key:string) => any - Returns cached value for key or undefined for cache miss.
     *      remove(key:string) - Removes pair from the cache identified by the key.
     *      removeAll() - Removes all cached pairs.
     *      destroy() - Removes references to this cache from nuiTransientCacheFactory.
     */
    public create = (cacheId: string): ITransientCache => {
        if (this.cacheMap[cacheId] == null) {
            this.cacheMap[cacheId] = new TransientCacheService(
                this.utilService
            );
            return this.get(cacheId);
        } else {
            throw new Error("That cacheId already exists");
        }
    };

    /** @ngdoc method
     *  @name get
     *  @methodOf nui.services:TransientCacheFactory
     *  @description Get access to an ITransientCache object by the cacheId used when it was created.
     *  @param {string} cacheId Unique identifier of the cache.
     *  @returns {ITransientCache} cache Identified by cacheId. See
     *  {@link https://github.com/solarwinds/nova/blob/main/packages/bits/src/services/public-api.ts ITransientCache}.
     */
    public get = (cacheId: string): ITransientCache => this.cacheMap[cacheId];

    /** @ngdoc method
     *  @name count
     *  @methodOf nui.services:TransientCacheFactory
     *  @description Return the count of ITransientCache objects.
     *  @param {string} cacheId Unique identifier of the cache.
     *  @returns {number} Count of ITransientCache objects.
     */
    public count = (): number => size(this.cacheMap);
}
