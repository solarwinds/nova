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

import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { DialogService, TableComponent } from "@nova-ui/bits";

interface IExampleTableModel {
    issue: string;
    project: string;
    description: string;
    status: string;
    epic: string;
    assignee: string;
    reporter: string;
    actions: any;
}

@Component({
    selector: "nui-table-columns-add-remove-example",
    templateUrl: "./table-columns-add-remove.example.component.html",
    styleUrls: ["table-columns-add-remove.example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnsAddRemoveExampleComponent {
    public availableColumns = [
        "issue",
        "project",
        "description",
        "status",
        "epic",
        "assignee",
        "reporter",
        "actions",
    ];
    public displayedColumns = [
        "issue",
        "project",
        "description",
        "status",
        "epic",
        "actions",
    ];
    // full copy of displayed columns added to update columns only when updateTable() is called
    public displayedColumnsCopy = this.displayedColumns.slice();
    public myForm;
    public newColumn: string;
    public dataSource = getData();
    @ViewChild(TableComponent) table: TableComponent<IExampleTableModel>;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        private formBuilder: FormBuilder
    ) {
        this.myForm = this.formBuilder.group({
            checkboxGroup: this.formBuilder.control(this.displayedColumnsCopy, [
                Validators.required,
                Validators.minLength(3),
            ]),
        });
    }

    public columnsChanged(columns: any): void {
        this.displayedColumnsCopy = columns;
    }

    public isChecked(vegetable: string): boolean {
        return this.displayedColumnsCopy.indexOf(vegetable) > -1;
    }

    public open(content: TemplateRef<string>): void {
        this.dialogService.open(content, { size: "sm" });
    }

    public updateNewColumnValue(event: any): void {
        this.newColumn = event;
    }

    public addNewColumn(): void {
        if (this.newColumn) {
            this.availableColumns.push(this.newColumn);
            this.displayedColumnsCopy.push(this.newColumn);
            this.newColumn = "";
        }
    }

    public updateColumns(): void {
        this.displayedColumns = this.displayedColumnsCopy.slice();
    }

    public columnIsActions(column: string): boolean {
        return column === "actions";
    }

    public deleteRow(row: IExampleTableModel): void {
        this.dataSource.splice(this.dataSource.indexOf(row, 0), 1);
        this.table.renderRows();
    }

    public appendRow(): void {
        this.dataSource.splice(this.dataSource.length, 0, getRowDataToAppend());
        this.table.renderRows();
    }

    public prependRow(): void {
        this.dataSource.splice(0, 0, getRowDataToPrepend());
        this.table.renderRows();
    }
}

/** Table data */
function getData(): IExampleTableModel[] {
    return [
        {
            issue: "NUI-111",
            project: "Nova NUI",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            status: "In Progress",
            epic: "Table Component",
            assignee: "Alex",
            reporter: "Maria",
            actions: "Some custom date here",
        },
        {
            issue: "NUI-222",
            project: "Nova NUI",
            description: "Sed ut perspiciatis unde omnis iste natus error sit.",
            status: "In Progress",
            epic: "Table Component",
            assignee: "Maria",
            reporter: "Peter",
            actions: "Some custom date here",
        },
        {
            issue: "NUI-333",
            project: "Nova NUI",
            description:
                "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            status: "In Progress",
            epic: "Table Component",
            assignee: "John",
            reporter: "Rob",
            actions: "Some custom date here",
        },
        {
            issue: "NUI-444",
            project: "Nova NUI",
            description:
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            status: "Done",
            epic: "Textbox Component",
            assignee: "Alberto",
            reporter: "Emma",
            actions: "Some custom date here",
        },
        {
            issue: "NUI-555",
            project: "Nova NUI",
            description:
                "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            status: "Open",
            epic: "Textbox Component",
            assignee: "Rob",
            reporter: "Emma",
            actions: "Some custom date here",
        },
    ];
}

function getRowDataToPrepend(): IExampleTableModel {
    return {
        issue: "NUI-100",
        project: "Nova NUI",
        description: "This row is added to the beginning",
        status: "New status",
        epic: "Radio Component",
        assignee: "Maria",
        reporter: "Rob",
        actions: "Some custom date here",
    };
}

function getRowDataToAppend(): IExampleTableModel {
    return {
        issue: "NUI-1100",
        project: "Nova NUI",
        description: "This row is added",
        status: "New status",
        epic: "Radio Component",
        assignee: "Maria",
        reporter: "Rob",
        actions: "Some custom date here",
    };
}
