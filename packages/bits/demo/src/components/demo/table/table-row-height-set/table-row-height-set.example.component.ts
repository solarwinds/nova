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

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

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
    selector: "nui-table-row-height-set",
    templateUrl: "./table-row-height-set.example.component.html",
    styleUrls: ["./table-row-height-set.example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowHeightSetExampleComponent {
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
    @Input() density: string = "tiny";
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
            status: "status_up",
            outages: 9,
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
            status: "status_up",
            outages: 95,
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
            status: "status_up",
            outages: 45,
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
            status: "status_up",
            outages: 85,
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
            status: "status_up",
            outages: 33,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
    ];
}
