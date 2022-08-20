import { Component, ViewChild } from "@angular/core";

import { TableComponent } from "../table.component";

import { TableSpecHelpers } from "./table-spec-helpers";

@Component({
    template: `
        <table nui-table [dataSource]="dataSource" [sortable]="true">
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
            <tr nui-header-row *nuiHeaderRowDef="displayedColumns"></tr>
            <tr nui-row *nuiRowDef="let row; columns: displayedColumns"></tr>
        </table>
    `,
})
export class SortableTableComponent {
    public displayedColumns = ["position", "name", "asset", "location"];
    public dataSource = TableSpecHelpers.getTableInitialData();
    @ViewChild(TableComponent, { static: true })
    tableComponent: TableComponent<any>;
}
