import {
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";

import { TableSpecHelpers } from "./table-spec-helpers";

@Component({
    template: `
        <div class="nui">
            <div class="nui-table__container" #tableContainer>
                <table
                    nui-table
                    [dataSource]="dataSource"
                    [resizable]="true"
                    [selectable]="true"
                >
                    <ng-container nuiColumnDef="position">
                        <th id="drag-id" nui-header-cell *nuiHeaderCellDef>
                            No.
                        </th>
                        <td nui-cell *nuiCellDef="let element">
                            {{ element.position }}
                        </td>
                    </ng-container>
                    <ng-container nuiColumnDef="name">
                        <th nui-header-cell *nuiHeaderCellDef>Name</th>
                        <td nui-cell *nuiCellDef="let element">
                            {{ element.name }}
                        </td>
                    </ng-container>
                    <ng-container nuiColumnDef="asset">
                        <th nui-header-cell *nuiHeaderCellDef>Asset Class</th>
                        <td nui-cell *nuiCellDef="let element">
                            {{ element.asset }}
                        </td>
                    </ng-container>
                    <ng-container nuiColumnDef="location">
                        <th nui-header-cell *nuiHeaderCellDef>Location</th>
                        <td nui-cell *nuiCellDef="let element">
                            {{ element.location }}
                        </td>
                    </ng-container>
                    <tr nui-header-row *nuiHeaderRowDef="displayedColumns"></tr>
                    <tr
                        nui-row
                        *nuiRowDef="let row; columns: displayedColumns"
                    ></tr>
                </table>
            </div>
        </div>
    `,
    styleUrls: ["../../../styles.less", "../table.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class ResizeTableComponent {
    public displayedColumns = ["position", "name", "asset", "location"];
    public dataSource = TableSpecHelpers.getTableInitialData();
    @ViewChild("tableContainer") tableContainer: ElementRef;
}
