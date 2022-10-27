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
    public selection: ISelection = {
        isAllPages: false,
        include: [2, 3],
        exclude: [],
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
            outages: 52,
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
            outages: 3,
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
            outages: 68,
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
            outages: 86,
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
            outages: 70,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
        {
            position: 6,
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
            outages: 71,
            checks: [
                {
                    icon: "status_mixed",
                    num: 25,
                },
            ],
        },
        {
            position: 7,
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
            outages: 6,
            checks: [
                {
                    icon: "status_external",
                    num: 25,
                },
            ],
        },
        {
            position: 8,
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
            outages: 15,
            checks: [
                {
                    icon: "status_inactive",
                    num: 25,
                },
            ],
        },
        {
            position: 9,
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
            outages: 16,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
        {
            position: 10,
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
            outages: 96,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
    ];
}
