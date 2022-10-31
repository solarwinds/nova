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

import { ITransientCache } from "./public-api";
import { TransientCacheService } from "./transient-cache.service";
import { UtilService } from "./util.service";

describe("services >", () => {
    describe("transientCache >", () => {
        let utilService: UtilService;
        let cache: ITransientCache;

        const getTestObj = (): any => ({
            key: "obj",
            msg: "hello world",
            someNumber: 9,
        });

        beforeEach(() => {
            utilService = <UtilService>{};
            utilService.sizeof = () => 1;
            cache = new TransientCacheService(utilService);
        });

        it("should add object to the cache", () => {
            const obj = getTestObj();
            expect(cache.entryCount()).toBe(0);
            cache.put(obj.key, obj, 3000);
            expect(cache.entryCount()).toBe(1);
            const myObj = cache.get(obj.key);
            expect(myObj).toBe(obj);
        });

        it("should remove object from the cache", () => {
            const obj = getTestObj();
            expect(cache.entryCount()).toBe(0);
            cache.put(obj.key, obj, 3000);
            expect(cache.entryCount()).toBe(1);
            cache.remove(obj.key);
            expect(cache.entryCount()).toBe(0);
            const myObj = cache.get(obj.key);
            expect(myObj).toBeUndefined();
        });

        it("should remove all objects from the cache", () => {
            const obj1 = getTestObj();
            const obj2 = { key: "obj2", msg: "grumble", someNumber: 99 };
            const obj3 = {
                key: "obj3",
                msg: "grumble grumble",
                someNumber: 999,
            };
            expect(cache.entryCount()).toBe(0);
            cache.put(obj1.key, obj1, 3000);
            cache.put(obj2.key, obj2, 3000);
            cache.put(obj3.key, obj3, 3000);
            expect(cache.entryCount()).toBe(3);
            let objRetrieved = cache.get(obj2.key);
            expect(objRetrieved).toBe(obj2);
            cache.removeAll();
            expect(cache.entryCount()).toBe(0);
            objRetrieved = cache.get(obj2.key);
            expect(objRetrieved).toBeUndefined();
        });

        it("should be removed from the cache on timeout interval provided", () => {
            const obj = getTestObj();
            const obj2 = { key: "obj2", msg: "grumble", someNumber: 99 };
            let notifiedOnExpiration = false;
            let notifiedOnExpiration1 = false;

            cache.put(obj.key, obj, 1).then(() => {
                notifiedOnExpiration = true;
            });
            cache.put(obj2.key, obj2, 3000).then(() => {
                notifiedOnExpiration1 = true;
            });

            // We need to wait 100 ms to let the cache erase the expired element
            setTimeout(() => {
                // at this point the first object should be expired
                expect(cache.entryCount()).toBe(1);
                expect(notifiedOnExpiration).toBe(true);
                expect(notifiedOnExpiration1).toBe(false);
            }, 100);
        });

        it("should call utilService to calculate cache size", () => {
            const spy = spyOn(utilService, "sizeof");

            cache.put("key", getTestObj(), 3000);
            cache.size();

            expect(spy.calls.count()).toEqual(2);
        });
    });
});
