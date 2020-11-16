import { UtilityService } from "./utility.service";

describe("utility service", () => {

    describe("binarySearch", () => {

        it("returns first", () => {
            const haystack = [1, 2, 3];
            const needle = 0.5;

            expect(UtilityService.findNearestIndex(haystack, needle)).toEqual(0);
        });

        it("returns last", () => {
            const haystack = [1, 2, 3];
            const needle = 3;

            expect(UtilityService.findNearestIndex(haystack, needle)).toEqual(2);
        });

        it("returns value in the middle", () => {
            const haystack = [1, 2];
            const needle = 1.5;

            expect(UtilityService.findNearestIndex(haystack, needle)).toEqual(1);
        });

    });

});
