import { Injectable } from "@angular/core";
import { DataSourceService, INovaFilteringOutputs, INovaFilters, SearchService } from "@nova-ui/bits";
import { BehaviorSubject } from "rxjs";

import {
    IRandomUserResponse,
    IRandomUserResults,
    IRandomUserTableModel,
    UsersQueryResponse,
} from "./table-virtual-scroll-real-api/table-virtual-scroll-real-api.example.component";

@Injectable()
export class RandomuserTableDataSource1 extends DataSourceService<IRandomUserTableModel> {
    private readonly url = "https://randomuser.me/api";
    private readonly seed = "sw";
    private page: number = 1;
    private dataStart: number = 0;
    private cache = Array.from<IRandomUserTableModel>({ length: 0 });

    public step: BehaviorSubject<number> = new BehaviorSubject(100);
    public busy = new BehaviorSubject(false);
    public itemsToLoad: BehaviorSubject<number> = new BehaviorSubject(500);

    constructor(private searchService: SearchService) {
        super();
    }

    public async getFilteredData(filters: INovaFilters): Promise<INovaFilteringOutputs> {
        this.busy.next(true);

        // We're returning Promise with setTimeout here to make the response from the server longer, as the API being used sends responses
        // almost immediately. We need it longer to be able the show the spinner component on data load
        return new Promise(resolve => {
            setTimeout(() => {
                this.getData(this.dataStart, this.dataStart + this.step.value).then((response: UsersQueryResponse | undefined) => {
                    if (!response) { return; }

                    this.cache = this.cache.concat(response.users);
                    this.dataSubject.next(this.cache);
                    resolve({
                        repeat: {
                            itemsSource: this.cache,
                        },
                        // This API can return thousands of results, however doesn't return the max number of results,
                        // so we set the max number of result manually here.
                        itemsToLoad: this.itemsToLoad.value,
                        totalItems: 1575,
                        start: response.start,
                    });
                    this.busy.next(false);
                    this.dataStart += this.step.value;
                    this.page++;
                });
            }, 500);
        });
    }

    public async getData(start: number = 0, end: number= 20): Promise<UsersQueryResponse | undefined> {
        let response: IRandomUserResponse | undefined;
        try {
            response = await
            (await fetch(`${this.url}/?page=${this.page}&results=${end - start}&seed=${this.seed}`))
                .json();
            return {
                users: response?.results.map((result: IRandomUserResults, i: number) => ({
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
                })),
                total: response?.results.length,
                start: start,
            } as UsersQueryResponse;
        } catch (e) {
            console.error("Error responding from server. Please visit https://https://randomuser.me/ to see if it's available");
        }
    }
}
