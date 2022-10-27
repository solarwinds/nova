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

import { DataAccessor } from "../../../core/common/types";
import { IRectangleSeriesAccessors } from "../../accessors/rectangle-accessors";
import { IBarAccessors, IBarDataAccessors } from "./bar-accessors";

export interface IStatusDataAccessors extends IBarDataAccessors {
    status: DataAccessor;
}

export interface IStatusAccessors extends IBarAccessors {
    data: IStatusDataAccessors;
}

export class StatusAccessors implements IStatusAccessors {
    public static STATUS_CATEGORY = "status";
    public static STATUS_DOMAIN = [StatusAccessors.STATUS_CATEGORY];

    public get data(): IStatusDataAccessors {
        return this.barAccessors.data as IStatusDataAccessors;
    }

    public get series(): IRectangleSeriesAccessors {
        return this.barAccessors.series;
    }

    constructor(private barAccessors: IBarAccessors) {
        barAccessors.data.status = (d: any) => d.status;
    }
}
