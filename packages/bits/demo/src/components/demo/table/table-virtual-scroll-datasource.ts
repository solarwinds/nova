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
import { BehaviorSubject } from "rxjs";

import {
    DataSourceService,
    INovaFilteringOutputs,
    INovaFilters,
} from "@nova-ui/bits";

import {
    IRandomUserResponse,
    IRandomUserResults,
    IRandomUserTableModel,
    UsersQueryResponse,
} from "./table-virtual-scroll-real-api/table-virtual-scroll-real-api.example.component";

@Injectable()
export class RandomuserTableDataSource extends DataSourceService<IRandomUserTableModel> {
    private readonly url = "https://randomuser.me/api";
    private readonly seed = "sw";

    private cache = Array.from<IRandomUserTableModel>({ length: 0 });
    public page: number = 1;
    public busy = new BehaviorSubject(false);

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<INovaFilteringOutputs> {
        this.busy.next(true);
        const virtualScrollFilter =
            filters.virtualScroll && filters.virtualScroll.value;
        const start = virtualScrollFilter
            ? filters.virtualScroll?.value.start
            : 0;
        const end = virtualScrollFilter ? filters.virtualScroll?.value.end : 0;

        // We're returning Promise with setTimeout here to make the response from the server longer, as the API being used sends responses
        // almost immediately. We need it longer to be able the show the spinner component on data load
        return new Promise((resolve) => {
            setTimeout(() => {
                this.getData(start, end).then(
                    (response: UsersQueryResponse | undefined) => {
                        if (!response) {
                            return;
                        }

                        this.cache = this.cache.concat(response.users);
                        this.dataSubject.next(this.cache);
                        resolve({
                            repeat: {
                                itemsSource: this.cache,
                            },
                            // This API can return thousands of results, however doesn't return the max number of results,
                            // so we set the max number of result manually here.
                            totalItems: 200,
                            start: response.start,
                        });
                        this.busy.next(false);
                    }
                );
            }, 2000);
        });
    }

    public async getData(
        start: number = 0,
        end: number = 20
    ): Promise<UsersQueryResponse | undefined> {
        let response: IRandomUserResponse | undefined;
        try {
            response = await (
                await fetch(
                    `${this.url}/?page=${this.page}&results=${
                        end - start
                    }&seed=${this.seed}`
                )
            ).json();
            return {
                users: response?.results.map(
                    (result: IRandomUserResults, i: number) => ({
                        no: this.cache.length + i + 1,
                        nameTitle: result.name.title,
                        nameFirst: result.name.first,
                        nameLast: result.name.last,
                        gender: result.gender,
                        country: result.location.country,
                        city: result.location.city,
                        postcode: result.location.postcode,
                        email: result.email,
                        cell: result.cell,
                    })
                ),
                total: response?.results.length,
                start: start,
            } as UsersQueryResponse;
        } catch (e) {
            console.error(
                "Error responding from server. Please visit https://https://randomuser.me/ to see if it's available"
            );
        }
    }
}
