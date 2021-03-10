import { Injectable } from "@angular/core";
import { IDataSource, INovaFilteringOutputs, ServerSideDataSource } from "@nova-ui/bits";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { DATA } from "./repeat-virtual-scroll-data";
import { IServerFilters, IServersCollection } from "./types";

@Injectable()
export class RepeatVirtualScrollDataSource<T> extends ServerSideDataSource<T> implements IDataSource {
    public async getFilteredData(data: IServersCollection): Promise<INovaFilteringOutputs> {
        return of(data).pipe(
            map((response: IServersCollection) => {
                const itemsSource = response.items;

                return {
                    repeat: { itemsSource },
                };
            })
        ).toPromise();
    }

    protected getBackendData(filters: IServerFilters): Observable<IServersCollection> {
        return of({
            items: DATA?.map(item => ({
                name: item.name,
                location: item.location,
                status: item.status,
            })) || [],
        });
    }
}
