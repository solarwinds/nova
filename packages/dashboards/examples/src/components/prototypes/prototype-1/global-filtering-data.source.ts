import { Injectable } from "@angular/core";
import { DataSourceService, IFilteringOutputs, IFilters } from "@nova-ui/bits";

@Injectable()
export class GlobalFilteringDataSource extends DataSourceService<any> {
    public async getFilteredData(
        filters: IFilters
    ): Promise<IFilteringOutputs> {
        // we only need this datasource to register filters, the actual data is not important for the example
        return Promise.resolve({} as IFilteringOutputs);
    }
}
