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
import { filter } from "lodash";

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
                // const virtualScrollFilter =
                //     filters.virtualScroll && filters.virtualScroll.value;

                // console.log("filters", filters);

                // if (virtualScrollFilter) {
                //     // The multiplier used here is a way to fetch more items per scroll
                //     const start = filters.virtualScroll?.value.start;
                //     const end = filters.virtualScroll?.value.end;
                //     // Note: We should start with a clean cache every time first page is requested
                //     if (start === 0) {
                //         this.cache = [];
                //     }
                //     const nextChunk = TABLE_DATA.slice(start, 10);
                //     // We identify here whether the cached array does already contain some of the fetched data.
                //     // Then we update the cached array with the only values it doesn't contain
                //     this.cache = this.cache.concat(
                //         nextChunk.filter((item) => !this.cache.includes(item))
                //     );
                //     super.setData(this.cache);
                // }

            //     const virtualScrollFilter =
            //     filters.virtualScroll && filters.virtualScroll.value;

            // if (virtualScrollFilter) {
            //     // The multiplier used here is a way to fetch more items per scroll
            //     const start = filters.virtualScroll?.value.start;
            //     const end = filters.virtualScroll?.value.end;
            //     // Note: We should start with a clean cache every time first page is requested
            //     if (start === 0) {
            //         this.cache = [];
            //     }
            //     const nextChunk = TABLE_DATA.slice(start, end);
            //     // We identify here whether the cached array does already contain some of the fetched data.
            //     // Then we update the cached array with the only values it doesn't contain
            //     this.cache = this.cache.concat(
            //         nextChunk.filter((item) => !this.cache.includes(item))
            //     );
            //     super.setData(this.cache);
            // }

                // const paginatorFilter =
                //     filters.paginator && filters.paginator.value;

                // console.log("paginatorFilter", paginatorFilter);
                // console.log("filters",filters);
                super.setData(TABLE_DATA);
                const filteredData = await super.getFilteredData(filters);

                // console.log("filteredData", filteredData);

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
