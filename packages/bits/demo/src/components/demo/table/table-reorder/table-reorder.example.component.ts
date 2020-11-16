import { Component, Inject } from "@angular/core";
import { IToastService, ToastService } from "@solarwinds/nova-bits";

interface IExampleTableModel {
    position: number;
    name: string;
    features: any;
    asset: string;
    location: string;
    status: string;
    outages: number;
    checks: any;
}

@Component({
    selector: "nui-table-reorder-example",
    templateUrl: "./table-reorder.example.component.html",
    styleUrls: ["./table-reorder.example.component.less"],
})
export class TableReorderExampleComponent {
    public displayedColumns = ["position", "name", "features", "asset", "location", "status", "outages", "checks"];
    public dataSource = getData();

    constructor(@Inject(ToastService) private toastService: IToastService) { }

    public toastColumns(event: string[]) {
        this.toastService.info({ message: "Current order of columns is: " + event.toString().replace(/,/g, ", ") });
    }
}

/** Table data */
function getData(): IExampleTableModel[] {
    return [
        {
            position: 1,
            name: "FOCUS-SVR-02258",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "status_up",
            outages: 55,
            checks: [{
                icon: "status_up",
                num: 25,
            }],
        },
        {
            position: 2,
            name: "Man-LT-JYJ4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "status_up",
            outages: 6,
            checks: [{
                icon: "status_critical",
                num: 25,
            }],
        },
        {
            position: 3,
            name: "FOCUS-SVR-02258",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "status_up",
            outages: 7,
            checks: [{
                icon: "status_down",
                num: 25,
            }],
        },
        {
            position: 4,
            name: "Man-LT-JYJ4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "status_up",
            outages: 27,
            checks: [{
                icon: "status_up",
                num: 25,
            }],
        },
        {
            position: 5,
            name: "Man-LT-JYJ4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "status_up",
            outages: 18,
            checks: [{
                icon: "status_up",
                num: 25,
            }],
        },
   ];
}
