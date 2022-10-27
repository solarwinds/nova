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
import { TransientCacheFactory } from "./transient-cache-factory.service";
import { UtilService } from "./util.service";

describe("services >", () => {
    describe("transientCacheFactory >", () => {
        let utilService: UtilService;
        let cacheFactory: TransientCacheFactory;

        beforeEach(() => {
            utilService = <UtilService>{};
            cacheFactory = new TransientCacheFactory(utilService);
        });

        it("should create a new transientCache", () => {
            const cache: ITransientCache = cacheFactory.create("myCache");
            expect(cache).toBeDefined();
            expect(cacheFactory.count()).toEqual(1);
            const cache2 = cacheFactory.create("anotherCache");
            expect(cache2).toBeDefined();
            expect(cacheFactory.count()).toEqual(2);
            const cache3 = cacheFactory.create("thirdCache");
            expect(cache3).toBeDefined();
            expect(cacheFactory.count()).toEqual(3);
        });

        it("should be able to get cache by id", () => {
            const cacheId = "myCache";
            const cache = cacheFactory.create(cacheId);
            expect(cache).toBeDefined();
            expect(cacheFactory.count()).toEqual(1);
            expect(cacheFactory.get(cacheId)).toBe(cache);
        });

        it("should throw if cache already exists", () => {
            const cache = cacheFactory.create("myCache");
            expect(cache).toBeDefined();
            expect(cacheFactory.count()).toEqual(1);
            expect(() => cacheFactory.create("myCache")).toThrowError();
        });
    });
});
