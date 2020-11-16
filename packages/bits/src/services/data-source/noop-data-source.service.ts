import { DataSourceService } from "./data-source.service";
import { IFilteringOutputs, IFilters } from "./public-api";

/**
 * Basic data source service for front-end filtering
 */
export class NoopDataSourceService<T> extends DataSourceService<T> {
    public async getFilteredData(filters: IFilters): Promise<IFilteringOutputs> {
        return filters;
    }
}
