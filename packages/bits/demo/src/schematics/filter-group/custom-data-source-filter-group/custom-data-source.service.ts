import { Inject, Injectable } from "@angular/core";

import { DataSourceService, IFilters } from "@nova-ui/bits";

import { FakeHTTPService } from "../fake-http.service";
import { ExampleItem, ICustomDSFilteredData } from "./public-api";

@Injectable()
export class FilterGroupCustomDataSourceService extends DataSourceService<ExampleItem> {
    constructor(@Inject(FakeHTTPService) public httpService: FakeHTTPService) {
        super();
    }

    // Emitting current filters to 'server' via http service, to get filtered data 'ICustomDSFilteredData'
    public async getFilteredData(
        filters: IFilters
    ): Promise<ICustomDSFilteredData> {
        return await this.httpService.getData(filters);
    }
}
