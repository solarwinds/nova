import { DataSourceService, IFilteringOutputs, IFilters } from "@nova-ui/bits";

export class GlobalFilteringDataSource extends DataSourceService<any> {

    public getFilteredData(filters: IFilters): Promise<IFilteringOutputs> {
        return Promise.resolve({} as IFilteringOutputs);
    }

}
