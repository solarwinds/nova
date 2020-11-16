import { Inject, Injectable } from "@angular/core";
import { INovaFilteringOutputs, INovaFilters, LocalFilteringDataSource, SearchService } from "@solarwinds/nova-bits";
import { HttpStatusCode, IDataField, IDataSource, IDataSourceOutput } from "@solarwinds/nova-dashboards";
import { BehaviorSubject, Subject } from "rxjs";

export interface BasicTableModel {
    position: number;
    name: string;
    features: any;
    status: string;
    checks: any;
    "cpu-load": number;
    firstUrl: string;
    firstUrlLabel: string;
    secondUrl: string;
    secondUrlLabel: string;
}

interface ITableDataSourceOutput extends INovaFilteringOutputs {
    dataFields: IDataField[];
}

// This datasource extends LocalFilteringDataSource. Link to api docs below:
// http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/injectables/LocalFilteringDataSource.html
// If you need to work with back-end filtering, you need to extend DataSourceService instead of LocalFilteringDataSource
@Injectable()
export class TestTableDataSource extends LocalFilteringDataSource<BasicTableModel> implements IDataSource {
    public static providerId = "TestTableDataSource";
    public static mockError = false;

    private cache: any[] = [];

    public dataFields: Array<IDataField> = [
        { id: "position", label: $localize`Position`, dataType: "number" },
        { id: "name", label: $localize`Name`, dataType: "string" },
        { id: "features", label: $localize`Features`, dataType: "icons" },
        { id: "checks", label: $localize`Checks`, dataType: "iconAndText" },
        { id: "status", label: $localize`Status`, dataType: "string" },
        { id: "firstUrl", label: $localize`First Url`, dataType: "link" },
        { id: "firstUrlLabel", label: $localize`First Url Label`, dataType: "label" },
    ];

    public tableData: Array<any>;
    public outputsSubject: Subject<any>;

    constructor(@Inject(SearchService) searchService: SearchService) {
        super(searchService);
        super.setData([]);
    }

    /**
     * Makes a request to get correct data depending on filters
     * @param filters
     */
    public async getFilteredData(filters: INovaFilters): Promise<IDataSourceOutput<ITableDataSourceOutput>> {
        const virtualScrollFilter = filters.virtualScroll && filters.virtualScroll.value;

        if (virtualScrollFilter) {
            // The multiplier used here is a way to fetch more items per scroll
            const start = filters.virtualScroll?.value.start;
            const end = filters.virtualScroll?.value.end;
            const nextChunk = TABLE_DATA.slice(start, end);
            // We identify here whether the cached array does already contain some of the fetched data.
            // Then we update the cached array with the only values it doesn't contain
            this.cache = this.cache.concat(nextChunk.filter(item => !this.cache.includes(item)));
            super.setData(this.cache);
        }

        const filteredData = await super.getFilteredData(filters);
        if (filteredData.paginator) {
            filteredData.paginator.total = TABLE_DATA.length;
        }

        if (!TestTableDataSource.mockError) {
            return {
                result: {
                    ...filteredData, dataFields: this.dataFields,
                },
            };
        }

        return {
            // @ts-ignore: Mock
            result: null,
            error: { type: HttpStatusCode.Unknown },
        };
    }
}


@Injectable()
export class TestTableDataSource2 extends LocalFilteringDataSource<BasicTableModel> implements IDataSource {
    public static providerId = "TestTableDataSource2";
    public static mockError = false;

    private cache: any[] = [];

    public busy = new BehaviorSubject(false);
    public dataFields: Array<IDataField> = [
        { id: "position", label: $localize`Position`, dataType: "number" },
        { id: "name", label: $localize`Name`, dataType: "string" },
        { id: "status", label: $localize`Status`, dataType: "string" },
        { id: "cpu-load", label: $localize`CPU load`, dataType: "number" },
        { id: "secondUrl", label: $localize`Second Url`, dataType: "link" },
        { id: "secondUrlLabel", label: $localize`Second Url Label`, dataType: "label" },
    ];

    public tableData: Array<any>;
    public outputsSubject: Subject<any>;

    constructor(@Inject(SearchService) searchService: SearchService) {
        super(searchService);
        super.setData([]);
    }

    public async getFilteredData(filters: INovaFilters): Promise<IDataSourceOutput<ITableDataSourceOutput>> {
        const virtualScrollFilter = filters.virtualScroll && filters.virtualScroll.value;

        if (virtualScrollFilter) {
            // The multiplier used here is a way to fetch more items per scroll
            const start = filters.virtualScroll?.value.start;
            const end = filters.virtualScroll?.value.end;
            const nextChunk = TABLE_DATA2.slice(start, end);
            // We identify here whether the cached array does already contain some of the fetched data.
            // Then we update the cached array with the only values it doesn't contain
            this.cache = this.cache.concat(nextChunk.filter(item => !this.cache.includes(item)));
            super.setData(this.cache);
        }

        const filteredData = await super.getFilteredData(filters);
        if (filteredData.paginator) {
            filteredData.paginator.total = TABLE_DATA2.length;
        }

        if (!TestTableDataSource.mockError) {
            return {
                result: {
                    ...filteredData, dataFields: this.dataFields,
                },
            };
        }

        return {
            // @ts-ignore: Mock
            result: null,
            error: { type: HttpStatusCode.Unknown },
        };
    }

}

const TABLE_DATA: BasicTableModel[] = [
    {
        position: 1,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 2,
        name: "FOCUS-SVR-03312",
        features: ["tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_critical",
            num: 25,
        },
        "cpu-load": 47,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 3,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_down",
            num: 25,
        },
        "cpu-load": 53,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 4,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 5,
        name: "Man-LT-JYJ425",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 22,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 6,
        name: "Man-LT-JYJ4333",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 12,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 7,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 8,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 35,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 9,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 10,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 64,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 11,
        name: "Man-LT-111",
        features: [],
        status: "Active",
        checks: {
            icon: "status_external",
            num: 25,
        },
        "cpu-load": 55,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 12,
        name: "Man-LT-2222",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 34,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 13,
        name: "Man-LT-333333",
        features: ["remote-access-vpn-tunnel", "tools", "database", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 56,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 14,
        name: "Man-LT-444444",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 26,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 15,
        name: "Man-LT-555555",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 76,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 16,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 17,
        name: "FOCUS-SVR-03312",
        features: ["tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_critical",
            num: 25,
        },
        "cpu-load": 47,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 18,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_down",
            num: 25,
        },
        "cpu-load": 53,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 19,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 20,
        name: "Man-LT-JYJ425",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 22,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 21,
        name: "Man-LT-JYJ4333",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 12,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 22,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 23,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 35,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 24,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 25,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 64,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 26,
        name: "Man-LT-111",
        features: [],
        status: "Active",
        checks: {
            icon: "status_external",
            num: 25,
        },
        "cpu-load": 55,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 27,
        name: "Man-LT-2222",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 34,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 28,
        name: "Man-LT-333333",
        features: ["remote-access-vpn-tunnel", "tools", "database", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 56,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 29,
        name: "Man-LT-444444",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 26,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 30,
        name: "Man-LT-555555",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 76,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 31,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 32,
        name: "FOCUS-SVR-03312",
        features: ["tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_critical",
            num: 25,
        },
        "cpu-load": 47,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 33,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_down",
            num: 25,
        },
        "cpu-load": 53,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 34,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 35,
        name: "Man-LT-JYJ425",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 22,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 36,
        name: "Man-LT-JYJ4333",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 12,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 37,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 38,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 35,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 39,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "tools", "database", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 40,
        name: "Man-LT-JYJ4AD5",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 64,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 41,
        name: "Man-LT-111",
        features: [],
        status: "Active",
        checks: {
            icon: "status_external",
            num: 25,
        },
        "cpu-load": 55,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 42,
        name: "Man-LT-2222",
        features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 34,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 43,
        name: "Man-LT-333333",
        features: ["remote-access-vpn-tunnel", "tools", "database", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 56,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 44,
        name: "Man-LT-444444",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 26,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 45,
        name: "Man-LT-555555",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 76,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
];

const TABLE_DATA2: BasicTableModel[] = [
    {
        position: 1,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 2,
        name: "FOCUS-SVR-03312",
        features: ["tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_critical",
            num: 25,
        },
        "cpu-load": 47,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 3,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "database", "orion-ape-backup", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_down",
            num: 25,
        },
        "cpu-load": 53,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
];
