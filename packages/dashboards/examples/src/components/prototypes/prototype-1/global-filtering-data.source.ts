import { Injectable } from "@angular/core";
import { DataSourceService, IFilteringOutputs, IFilters } from "@nova-ui/bits";

@Injectable()
export class GlobalFilteringDataSource extends DataSourceService<any> {

    public getFilteredData(filters: IFilters): Promise<IFilteringOutputs> {
        return Promise.resolve({} as IFilteringOutputs);
    }

}
