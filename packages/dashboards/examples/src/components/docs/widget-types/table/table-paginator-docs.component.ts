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

import { Component } from "@angular/core";

@Component({
    selector: "nui-table-paginator-docs",
    templateUrl: "./table-paginator-docs.component.html",
    standalone: false
})
export class TablePaginatorDocsComponent {
    public tableConfigurationText = `
        "table": {
            ...
            properties: {
                configuration: {
                    // define paginator configuration here
                    scrollType: ScrollType.paginator,
                    paginatorConfiguration: {
                        pageSize: 10, // Value have to be one of pageSizeSet values
                        pageSizeSet: [10, 20, 30],
                    },
                    // If not specified, default is set to 
                    // pageSize: 10,
                    // pageSizeSet: [10, 20, 50], 
                    hasVirtualScroll: false, // Has to be speciefied because of backward compatibility
                } as ITableWidgetConfig,
            },
        },
    `;
}
