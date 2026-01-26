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

import { getColorValueByName } from "./color.helper";

describe("getColorValueByName", () => {
    let getComputedStyleSpy: jasmine.Spy;

    beforeEach(() => {
        getComputedStyleSpy = spyOn(window, "getComputedStyle").and.callFake(
            () =>
                ({
                    getPropertyValue: (name: string) => {
                        if (name === "--primary-color") {
                            return "rgb(255, 0, 0)";
                        }
                        if (name === "--secondary-color") {
                            return "#00ff00";
                        }
                        return "";
                    },
                } as any)
        );
    });

    it("should return the same value if it does not start with var(", () => {
        const result = getColorValueByName("#123456");
        expect(result).toBe("#123456");
        expect(getComputedStyleSpy).not.toHaveBeenCalled();
    });

    it("should extract the variable name and return its computed value", () => {
        const result = getColorValueByName("var(--primary-color)");
        expect(getComputedStyleSpy).toHaveBeenCalledWith(document.body);
        expect(result).toBe("rgb(255, 0, 0)");
    });

    it("should handle another CSS variable correctly", () => {
        const result = getColorValueByName("var(--secondary-color)");
        expect(result).toBe("#00ff00");
    });

    it("should return empty string if variable is not defined in computed styles", () => {
        const result = getColorValueByName("var(--undefined-color)");
        expect(result).toBe("");
    });
});
