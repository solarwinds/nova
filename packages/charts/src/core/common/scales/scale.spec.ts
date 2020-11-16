import { Scale } from "./scale";

class TestScale extends Scale<any> {
    public mockDomain = [0, 0];

    constructor() { super(); }

    protected createD3Scale(): any {
        return { domain: (): any[] => this.mockDomain};
    }

    // @ts-ignore: Disabled for testing purposes
    public convert = (): number => null;
    public invert = (coordinate: number): number => 0;
    public isContinuous = (): boolean => true;
}

describe("Scale >", () => {
    describe("isDomainValid", () => {
        it("should return true if the domain is valid", () => {
            const scale = new TestScale();
            expect(scale.isDomainValid()).toEqual(true);
        });

        it("should return false if the domain is invalid", () => {
            const scale = new TestScale();
            // @ts-ignore: Disabled for testing purposes
            scale.mockDomain = [undefined, undefined];
            expect(scale.isDomainValid()).toEqual(false);
        });
    });
});
