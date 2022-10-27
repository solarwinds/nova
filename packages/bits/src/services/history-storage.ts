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

import { Injectable } from "@angular/core";

/**
 * This class can help with storing and managing the history of state mutations
 */
@Injectable()
export class HistoryStorage<T> {
    private stack: T[] = [];

    /**
     * The index of current history element (equals -1 when there are no items, 0 for first item)
     */
    public index = -1;

    /**
     * Add a new record to the storage
     *
     * @param value
     */
    public save(value: T): T {
        this.stack.splice(this.index + 1, this.length, value);
        this.index = this.length - 1;
        return this.current();
    }

    /**
     * Rewind the history and return the record before the last one. A redo will still be available after this.
     */
    public undo(): T {
        if (this.index > 0) {
            this.index--;
        }
        return this.current();
    }

    /**
     * Moves on to the next step in history if undo was previously triggered
     */
    public redo(): T {
        if (this.index < this.length - 1) {
            this.index++;
        }
        return this.current();
    }

    /**
     * Clears the storage
     */
    public reset() {
        this.index = -1;
        this.stack = [];
    }

    /**
     * Clears the storage and saves the initial value or preserves the previous one
     */
    public restart(value: T = this.stack[0]): T {
        this.reset();
        if (typeof value === "undefined") {
            return value;
        }
        return this.save(value);
    }

    /**
     * Returns the currently valid stored element
     */
    public current() {
        return this.stack[this.index];
    }

    /**
     * Returns the current history step (starts from 0 when there are no items, 1 for one item)
     */
    public get step() {
        return this.index + 1;
    }

    /**
     * Number of total saved steps in the history
     */
    public get length() {
        return this.stack.length;
    }
}
