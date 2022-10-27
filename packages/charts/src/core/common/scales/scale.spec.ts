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

import { Scale } from "./scale";

class TestScale extends Scale<any> {
    public mockDomain = [0, 0];

    constructor() {
        super();
    }

    protected createD3Scale(): any {
        return { domain: (): any[] => this.mockDomain };
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
