import { ChangeDetectionStrategy, Component } from "@angular/core";

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
    selector: "nui-table-basic-example",
    templateUrl: "./table-basic.example.component.html",
    styleUrls: ["./table-basic.example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableBasicExampleComponent {
    public displayedColumns = [
        "position",
        "name",
        "features",
        "asset",
        "location",
        "status",
        "outages",
        "checks",
    ];
    public dataSource = getData();
}

/** Table data */
function getData(): IExampleTableModel[] {
    return [
        {
            position: 1,
            name: "FOCUS-SVR-02258",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 25,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
        {
            position: 2,
            name: "Man-LT-JYJ4AD5",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 31,
            checks: [
                {
                    icon: "status_critical",
                    num: 25,
                },
            ],
        },
        {
            position: 3,
            name: "FOCUS-SVR-02258",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 15,
            checks: [
                {
                    icon: "status_down",
                    num: 25,
                },
            ],
        },
        {
            position: 4,
            name: "Man-LT-JYJ4AD5",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 22,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
        {
            position: 5,
            name: "Man-LT-JYJ4AD5",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 37,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
    ];
}
