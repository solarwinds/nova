import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

import {
    IDataField,
    INovaFilters,
    LocalFilteringDataSource,
    SearchService,
} from "@nova-ui/bits";

import { TABLE_DATA } from "../widget-data";
import { BasicTableModel, ITableDataSourceOutput } from "./types";

// This datasource extends LocalFilteringDataSource. Link to api docs below:
// https://nova-ui.solarwinds.io/bits/release_v12.x/injectables/LocalFilteringDataSource.html
// If you need to work with back-end filtering, you need to extend DataSourceService instead of LocalFilteringDataSource
@Injectable()
export class TableWidgetDataSource extends LocalFilteringDataSource<BasicTableModel> {
    private cache: any[] = [];

    public busy = new BehaviorSubject(false);
    public dataFields: Array<IDataField> = [
        { id: "position", label: $localize`Position`, dataType: "number" },
        { id: "name", label: $localize`Name`, dataType: "string" },
        { id: "features", label: $localize`Features`, dataType: "icons" },
        { id: "checks", label: $localize`Checks`, dataType: "iconAndText" },
        { id: "status", label: $localize`Status`, dataType: "string" },
        { id: "firstUrl", label: $localize`First Url`, dataType: "link" },
        {
            id: "firstUrlLabel",
            label: $localize`First Url Label`,
            dataType: "label",
        },
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
    public async getFilteredData(
        filters: INovaFilters
    ): Promise<ITableDataSourceOutput> {
        this.busy.next(true);

        return new Promise((resolve) => {
            setTimeout(async () => {
                const virtualScrollFilter =
                    filters.virtualScroll && filters.virtualScroll.value;

                if (virtualScrollFilter) {
                    // The multiplier used here is a way to fetch more items per scroll
                    const start = filters.virtualScroll?.value.start;
                    const end = filters.virtualScroll?.value.end;
                    const nextChunk = TABLE_DATA.slice(start, end);
                    // Note: We should start with a clean cache every time first page is requested
                    if (start === 0) {
                        this.cache = [];
                    }
                    // We identify here whether the cached array does already contain some of the fetched data.
                    // Then we update the cached array with the only values it doesn't contain
                    this.cache = this.cache.concat(
                        nextChunk.filter((item) => !this.cache.includes(item))
                    );
                    super.setData(this.cache);
                }

                const filteredData = await super.getFilteredData(filters);
                if (filteredData.paginator) {
                    filteredData.paginator.total = TABLE_DATA.length;
                }

                resolve({
                    ...filteredData,
                    dataFields: this.dataFields,
                });
                this.busy.next(false);
            }, 500);
        });
    }
}

@Injectable()
export class TableWidgetDataSource2 extends TableWidgetDataSource {
    public busy = new BehaviorSubject(false);
    public dataFields: Array<IDataField> = [
        { id: "position", label: $localize`Position`, dataType: "number" },
        { id: "name", label: $localize`Name`, dataType: "string" },
        { id: "status", label: $localize`Status`, dataType: "string" },
        { id: "cpu-load", label: $localize`CPU load`, dataType: "number" },
        { id: "secondUrl", label: $localize`Second Url`, dataType: "link" },
        {
            id: "secondUrlLabel",
            label: $localize`Second Url Label`,
            dataType: "label",
        },
    ];
    public tableData: Array<any>;

    constructor(@Inject(SearchService) searchService: SearchService) {
        super(searchService);
    }
}
