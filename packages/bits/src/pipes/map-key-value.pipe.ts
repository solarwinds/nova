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

import { KeyValue } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

/**
 * Pipe for transforming Map to KeyValue array without ordering
 *
 * __Parameters :__
 *
 *   input - source Map
 *
 * __Usage :__
 *   Map | nuiMapKeyValue
 *
 * __Example :__
 *   "let items of itemsMap | nuiMapKeyValue"
 *
 */
@Pipe({
    name: "nuiMapKeyValue",
    standalone: false,
})
export class MapKeyValuePipe implements PipeTransform {
    public transform<K, V>(input: ReadonlyMap<K, V>): Array<KeyValue<K, V>> {
        return Array.from(input.entries(), ([key, value]) => ({ key, value }));
    }
}
