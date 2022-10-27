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

import { IValueProvider } from "../types";
import { SequentialColorProvider } from "./sequential-color-provider";
import { TextColorProvider } from "./text-color-provider";

describe("SequentialValueProvider >", () => {
    let tcp: IValueProvider<string>;

    beforeEach(() => {
        tcp = new TextColorProvider(
            new SequentialColorProvider([
                "black",
                "white",
                "magenta", // black ratio = 6.69, white ratio = 3.13 => black wins!
            ]),
            {
                light: "white",
                dark: "black",
            }
        );
    });

    describe("get", () => {
        it("picks unique color and calculates best text color option for it, using contrast ratio", () => {
            expect(tcp.get("id1")).toBe("white");
            expect(tcp.get("id2")).toBe("black");
            expect(tcp.get("id3")).toBe("black");
        });
    });
});
