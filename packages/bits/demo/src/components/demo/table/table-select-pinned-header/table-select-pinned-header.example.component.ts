import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ISelection } from "@nova-ui/bits";

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
    selector: "nui-table-select-pinned-header-example",
    templateUrl: "./table-select-pinned-header.example.component.html",
    styleUrls: ["./table-select-pinned-header.example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSelectPinnedHeaderComponent {
    public displayedColumns = ["position", "name", "features", "asset", "location", "status", "outages", "checks"];
    public dataSource = getData();
    public selection: ISelection = {
        isAllPages: false,
        include: [2, 3],
        exclude: [ ],
    };

    public trackBy(index: number, item: IExampleTableModel): number {
        return item.position;
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
            status: "Active",
            outages: 52,
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
            status: "Active",
            outages: 3,
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
            status: "Active",
            outages: 68,
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
            status: "Active",
            outages: 86,
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
            status: "Active",
            outages: 70,
            checks: [{
                icon: "status_up",
                num: 25,
            }],
        },
        {
            position: 6,
            name: "Man-LT-JYJ4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 71,
            checks: [{
                icon: "status_mixed",
                num: 25,
            }],
        },
        {
            position: 7,
            name: "Man-LT-JYJ4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 6,
            checks: [{
                icon: "status_external",
                num: 25,
            }],
        },
        {
            position: 8,
            name: "Man-LT-JYJ4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 15,
            checks: [{
                icon: "status_inactive",
                num: 25,
            }],
        },
        {
            position: 9,
            name: "Man-LT-JYJ4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 16,
            checks: [{
                icon: "status_up",
                num: 25,
            }],
        },
        {
            position: 10,
            name: "Man-LT-JYJ4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 96,
            checks: [{
                icon: "status_up",
                num: 25,
            }],
        },
    ];
}
