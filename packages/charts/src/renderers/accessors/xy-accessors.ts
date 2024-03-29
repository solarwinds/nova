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

import { DataAccessor, IAccessors } from "../../core/common/types";

export interface IXYDataAccessors {
    /** Accessor for value plotted on the <code>x</code> coordinate */
    x: DataAccessor;
    /** Accessor for value plotted on the <code>y</code> coordinate */
    y: DataAccessor;
    /** Additional custom keys to match the base interface */
    [key: string]: DataAccessor | undefined;
}

export class XYAccessors implements IAccessors {
    /** The default data accessors for using with renderers deriving from XYRenderer */
    public data: IXYDataAccessors = {
        x: (d: any): number | undefined => d.x,
        y: (d: any): number | undefined => d.y,
    };
}
