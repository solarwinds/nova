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

import { TableSpecHelpers } from "./table-spec-helpers";

@Component({
    template: `
        <table nui-table [dataSource]="dataSource">
            <ng-container nuiColumnDef="position">
                <th id="drag-id" nui-header-cell *nuiHeaderCellDef>No.</th>
                <td nui-cell *nuiCellDef="let element">
                    {{ element.position }}
                </td>
            </ng-container>
            <ng-container nuiColumnDef="name">
                <th nui-header-cell *nuiHeaderCellDef>Name</th>
                <td nui-cell *nuiCellDef="let element">{{ element.name }}</td>
            </ng-container>
            <ng-container nuiColumnDef="asset">
                <th nui-header-cell *nuiHeaderCellDef>Asset Class</th>
                <td nui-cell *nuiCellDef="let element">{{ element.asset }}</td>
            </ng-container>
            <ng-container nuiColumnDef="location">
                <th nui-header-cell *nuiHeaderCellDef>Location</th>
                <td nui-cell *nuiCellDef="let element">
                    {{ element.location }}
                </td>
            </ng-container>
            <tr
                nui-header-row
                *nuiHeaderRowDef="displayedColumns; sticky: isSticky"
            ></tr>
            <tr
                nui-row
                *nuiRowDef="let row; columns: displayedColumns"
                density="tiny"
            ></tr>
        </table>
    `,
})
export class RowDensityTableComponent {
    public displayedColumns = ["position", "name", "asset", "location"];
    public dataSource = TableSpecHelpers.getTableInitialData();
}
