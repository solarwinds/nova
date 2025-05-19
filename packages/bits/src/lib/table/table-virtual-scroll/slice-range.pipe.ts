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

import { ListRange } from "@angular/cdk/collections";
import { SlicePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

import { nameof } from "../../../functions/nameof";

@Pipe({ name: "sliceRange", pure: false })
export class SliceRangePipe implements PipeTransform {
    slicePipe: SlicePipe = new SlicePipe();
    transform(value: unknown[], range: ListRange): unknown[] {
        if (
            !range.hasOwnProperty(nameof<ListRange>("start")) ||
            !range.hasOwnProperty(nameof<ListRange>("end"))
        ) {
            throw new Error("Invalid range provided");
        }

        return this.slicePipe.transform(value, range.start, range.end);
    }
}
