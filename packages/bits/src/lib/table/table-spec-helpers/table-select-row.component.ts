import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";

import { ISelection } from "../../../services/public-api";
import { TableComponent } from "../table.component";

export interface TableSelectModel {
    position: number;
    item: string;
    description: string;
    status: string;
    location: string;
}

const ELEMENT_DATA: TableSelectModel[] = [
    {
        position: 1,
        item: "FOCUS-SVR-02258123",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        status: "status_inactive",
        location: "Brno",
    },
    {
        position: 2,
        item: "Man-LT-JYJ4AD5",
        description: "Sed ut perspiciatis unde omnis iste natus error sit.",
        status: "status_up",
        location: "Brno",
    },
    {
        position: 3,
        item: "FOCUS-SVR-02258",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        status: "status_up",
        location: "Brno",
    },
    {
        position: 4,
        item: "Man-LT-JYJ4AD5",
        description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        status: "status_up",
        location: "Brno",
    },
    {
        position: 5,
        item: "Man-LT-JYJ4AD5",
        description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        status: "status_up",
        location: "Brno",
    },
];

/**
 * @ignore
 */
@Component({
    selector: "nui-table-select",
    template: `
        <div class="nui-table__container" id="nui-demo-table-select">
            <table nui-table [dataSource]="dataSource" [selectable]="true" (selectionChange)="onSelectorChange($event)">
                <ng-container nuiColumnDef="position">
                    <th nui-header-cell *nuiHeaderCellDef [style.width.px]="positionWidth"> No.</th>
                    <td nui-cell *nuiCellDef="let element"> {{element.position}}</td>
                </ng-container>

                <ng-container nuiColumnDef="item">
                    <th nui-header-cell *nuiHeaderCellDef> Item</th>
                    <td nui-cell *nuiCellDef="let element"> {{element.item}}</td>
                </ng-container>

                <ng-container nuiColumnDef="description">
                    <th nui-header-cell *nuiHeaderCellDef> Description</th>
                    <td nui-cell *nuiCellDef="let element" [tooltipText]="element.description">
                        {{element.description}}
                    </td>
                </ng-container>

                <ng-container nuiColumnDef="status" type="icon">
                    <th id="column-of-type-icon" nui-header-cell *nuiHeaderCellDef>
                        <nui-icon [icon]="'enable'"></nui-icon>
                    </th>
                    <td nui-cell *nuiCellDef="let element">
                        <nui-icon [icon]="element.status"></nui-icon>
                    </td>
                </ng-container>

                <ng-container nuiColumnDef="location">
                    <th nui-header-cell *nuiHeaderCellDef> Location</th>
                    <td nui-cell *nuiCellDef="let element"> {{element.location}}</td>
                </ng-container>

                <tr nui-header-row *nuiHeaderRowDef="displayedColumns; sticky:isSticky"></tr>
                <tr nui-row *nuiRowDef="let row; columns: displayedColumns;" [rowObject]="row"></tr>
            </table>
        </div>
    `,
})
export class TableSelectTestComponent {
    public displayedColumns = ["position", "item", "description", "status", "location"];
    public dataSource = ELEMENT_DATA;
    public selectedItems: ISelection;
    public isSticky = false;

    @ViewChild(TableComponent, {static: true}) tableComponent: TableComponent<any>;
    constructor(public changeDetection: ChangeDetectorRef) {
    }

    public onSelectorChange(selection: ISelection) {
        this.selectedItems = selection;
    }
}
