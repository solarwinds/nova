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

import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { IDataField, SearchService } from "@nova-ui/bits";

import { AcmeTableMockDataSource } from "./acme-table-mock-data-source.service";

@Injectable()
export class AcmeTableMockDataSource2 extends AcmeTableMockDataSource {
    public static providerId = "AcmeTableMockDataSource2";

    public busy = new BehaviorSubject(false);
    public dataFields: Array<IDataField> = [
        { id: "position", label: "Position", dataType: "number" },
        { id: "name", label: "Name", dataType: "string" },
        { id: "status", label: "Status", dataType: "string" },
        { id: "cpu-load", label: "CPU load", dataType: "number" },
        { id: "secondUrl", label: "Second Url", dataType: "link" },
        { id: "secondUrlLabel", label: "Second Url Label", dataType: "label" },
    ];
    public tableData: Array<any>;

    constructor(@Inject(SearchService) searchService: SearchService) {
        super(searchService);
    }
}
