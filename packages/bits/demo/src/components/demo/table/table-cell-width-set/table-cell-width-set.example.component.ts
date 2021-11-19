import { ChangeDetectionStrategy, Component } from "@angular/core";

interface IExampleTableModel {
    position: number;
    item: string;
    description: string;
    status: string;
    location: string;
}

@Component({
    selector: "nui-table-cell-width-set",
    templateUrl: "./table-cell-width-set.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellWidthSetExampleComponent {
    public positionWidth = 50;
    public displayedColumns = ["position", "item", "description", "status", "location"];
    public dataSource = getData();
    public onOptionChange(value: number): void {
        this.positionWidth = value;
    }
}

/** Table data */
function getData(): IExampleTableModel[] {
    return [
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
}
