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

import { Pipe, PipeTransform } from "@angular/core";
import isArray from "lodash/isArray";
import isNil from "lodash/isNil";

@Pipe({ name: "nuiAddData" })
export class AddDataPipe implements PipeTransform {
    transform(
        origin: object | Array<any> | undefined,
        value: any,
        key?: string
    ): object | Array<any> | any[] | undefined {
        if (isNil(origin)) {
            return;
        }

        if (isArray(origin)) {
            if (!value) {
                return origin;
            }

            const newArr = [...origin];
            newArr.push(value);

            return newArr;
        }

        const computedKey: string =
            typeof key === "undefined" ? "undefined" : key;
        return Object.assign({}, origin, { [computedKey]: value });
    }
}
