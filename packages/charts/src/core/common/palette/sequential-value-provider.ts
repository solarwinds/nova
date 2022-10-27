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

/**
 * This class matches the provided instances of type <T> to given series.
 * It keeps track of already given instances to given entities to avoid conflicts.
 */
export class SequentialValueProvider<T> implements IValueProvider<T> {
    private providedValues: { [key: string]: T };
    private lastUsedIndex: number;

    constructor(private values: T[]) {
        this.reset();
    }

    public get = (entityId: string): T => {
        let value = this.providedValues[entityId];
        if (!value) {
            const index = ++this.lastUsedIndex % this.values.length;
            value = this.values[index];
            this.providedValues[entityId] = value;
        }
        return value;
    };

    public reset(): void {
        this.providedValues = {};
        this.lastUsedIndex = -1;
    }
}
