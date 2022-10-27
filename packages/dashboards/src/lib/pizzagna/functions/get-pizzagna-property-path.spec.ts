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

import {
    getPizzagnaPropertyPath,
    IPizzagnaProperty,
} from "./get-pizzagna-property-path";

describe("getPizzagnaPropertyPath > ", () => {
    it("should get the property path from an IPizzagnaProperty", () => {
        const pizzagnaProperty: IPizzagnaProperty = {
            pizzagnaKey: "testKey",
            componentId: "testComponentId",
            propertyPath: ["testPathSegment1", "testPathSegment2"],
        };

        const expectedPath = [
            pizzagnaProperty.pizzagnaKey,
            pizzagnaProperty.componentId,
            "properties",
            ...pizzagnaProperty.propertyPath,
        ].join(".");

        const path = getPizzagnaPropertyPath(pizzagnaProperty);
        expect(path).toEqual(expectedPath);
    });
});
