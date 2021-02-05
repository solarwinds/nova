import { Inject, Injectable } from "@angular/core";
import { IDataField, SearchService } from "@nova-ui/bits";
import { BehaviorSubject } from "rxjs";

import { AcmeTableMockDataSource } from "./acme-table-mock-data-source.service";

@Injectable()
export class AcmeTableMockDataSource2 extends AcmeTableMockDataSource {
    public static providerId = "AcmeTableMockDataSource2";

    public busy = new BehaviorSubject(false);
    public dataFields: Array<IDataField> = [
        {id: "position", label: "Position", dataType: "number"},
        {id: "name", label: "Name", dataType: "string"},
        {id: "status", label: "Status", dataType: "string"},
        {id: "cpu-load", label: "CPU load", dataType: "number"},
        {id: "secondUrl", label: "Second Url", dataType: "link"},
        {id: "secondUrlLabel", label: "Second Url Label", dataType: "label"},
    ];
    public tableData: Array<any>;

    constructor(@Inject(SearchService) searchService: SearchService) {
        super(searchService);
    }
}
