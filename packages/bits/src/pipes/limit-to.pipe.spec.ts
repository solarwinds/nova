import { LimitToPipe } from "./limit-to.pipe";

describe("pipes >", () => {
    describe("limitTo pipe >", () => {
        const exampleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let limitToPipe: LimitToPipe;
        beforeEach(() => {
            limitToPipe = new LimitToPipe();
        });

        it("should return new array of less size when reducing size to 5", () => {
            const limitedArray = limitToPipe.transform(exampleArray, 5);
            expect(limitedArray.length).toEqual(5);
        });

        it("should return a new array when reducing size to the length of existing array", () => {
            const limitedArray = limitToPipe.transform(exampleArray, exampleArray.length);
            expect(limitedArray).not.toBe(exampleArray);
        });

        it("should return a new array of the initial size when reducing to size larger than existing array", () => {
            const limitedArray = limitToPipe.transform(exampleArray, exampleArray.length * 2);
            expect(limitedArray).not.toBe(exampleArray);
            expect(limitedArray.length).toEqual(exampleArray.length);
        });
    });
});
