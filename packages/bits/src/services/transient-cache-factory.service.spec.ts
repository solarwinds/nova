import { ITransientCache } from "./public-api";
import { TransientCacheFactory } from "./transient-cache-factory.service";
import { UtilService } from "./util.service";

describe("services >", () => {
    // TODO: Bring back in after NUI-5787
    xdescribe("transientCacheFactory >", () => {
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
