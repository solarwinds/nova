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

import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import {
    IDataSource,
    INovaFilteringOutputs,
    ServerSideDataSource,
} from "@nova-ui/bits";

import { DATA } from "./repeat-virtual-scroll-data";
import { IServerFilters, IServersCollection } from "./types";

@Injectable()
export class RepeatVirtualScrollDataSource<T>
    extends ServerSideDataSource<T>
    implements IDataSource
{
    public async getFilteredData(
        data: IServersCollection
    ): Promise<INovaFilteringOutputs> {
        return of(data)
            .pipe(
                map((response: IServersCollection) => {
                    const itemsSource = response.items;

                    return {
                        repeat: { itemsSource },
                    };
                })
            )
            .toPromise();
    }

    protected getBackendData(
        filters: IServerFilters
    ): Observable<IServersCollection> {
        return of({
            items:
                DATA?.map((item) => ({
                    name: item.name,
                    location: item.location,
                    status: item.status,
                })) || [],
        });
    }
}
