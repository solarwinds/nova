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

// If you need to work with back-end filtering, you need to extend DataSourceService instead of LocalFilteringDataSource
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

import {
    ClientSideDataSource,
    IDataField,
    INovaFilters,
    LocalFilteringDataSource,
    SearchService,
} from "@nova-ui/bits";

import { TABLE_DATA } from "../widget-data";
import { BasicTableModel, ITableDataSourceOutput } from "./types";

@Injectable()
export class AcmeTableMockDataSource extends ClientSideDataSource<BasicTableModel> {
    public static providerId = "AcmeTableMockDataSource";

    private cache: any[] = [];

    public busy = new BehaviorSubject(false);
    public dataFields: Array<IDataField> = [
        { id: "position", label: "Position", dataType: "number" },
        { id: "name", label: "Name", dataType: "string" },
        { id: "features", label: "Features", dataType: "icons" },
        {
            id: "checks",
            label: "Checks",
            dataType: "iconAndText",
            sortable: false,
        },
        { id: "status", label: "Status", dataType: "string", sortable: false },
        { id: "firstUrl", label: "First Url", dataType: "link" },
        { id: "firstUrlLabel", label: "First Url Label", dataType: "label" },
    ];

    public tableData: Array<any>;
    public outputsSubject: Subject<any>;

    constructor(@Inject(SearchService) searchService: SearchService) {
        super(searchService);
        super.setData([]);
    }

    /**
     * Makes a request to get correct data depending on filters
     * @param filters
     */
    public async getFilteredData(
        filters: INovaFilters
    ): Promise<ITableDataSourceOutput> {
        this.busy.next(true);

        return new Promise((resolve) => {
            setTimeout(async () => {
                // Set the data to the table
                super.setData(TABLE_DATA);

                const filteredData = await super.getFilteredData(filters);

                if (filteredData.paginator) {
                    filteredData.paginator.total = TABLE_DATA.length;
                }

                resolve({
                    ...filteredData,
                    dataFields: this.dataFields,
                });
                this.busy.next(false);
            }, 500);
        });
    }
}
