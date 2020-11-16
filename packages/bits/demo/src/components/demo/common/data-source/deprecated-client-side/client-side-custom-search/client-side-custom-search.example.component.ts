import { AfterViewInit, ChangeDetectorRef, Component, Injectable, OnDestroy, ViewChild } from "@angular/core";
import {
    INovaFilteringOutputs,
    LocalFilteringDataSource,
    PaginatorComponent,
    SearchComponent,
    SearchService,
} from "@solarwinds/nova-bits";
import { Subscription } from "rxjs";

const RANDOM_ARRAY = [
    {color: "regular-blue"},
    {color: "regular-green"},
    {color: "regular-yellow"},
    {color: "regular-cyan "},
    {color: "regular-magenta"},
    {color: "regular-black"},
    {color: "dark-blue"},
    {color: "dark-green"},
    {color: "dark-yellow"},
    {color: "dark-cyan "},
    {color: "dark-magenta"},
    {color: "dark-black"},
    {color: "light-blue"},
    {color: "light-green"},
    {color: "light-yellow"},
    {color: "light-cyan "},
    {color: "light-magenta"},
    {color: "light-black"},
];

interface ExampleItem {
    color: string;
}

@Injectable()
export class ClientSideCustomSearchService extends SearchService {
    protected filterPredicate(item: any, searchValue: any): boolean {
        return item.toString().indexOf(searchValue.toString()) !== -1;
    }
}

/**
 * @deprecated
 */
@Component({
    selector: "nui-deprecated-client-side-custom-search-example",
    templateUrl: "./client-side-custom-search.example.component.html",
    providers: [LocalFilteringDataSource, {provide: SearchService, useClass: ClientSideCustomSearchService}],
})
export class DepreacatedDataSourceClientSideCustomSearchExampleComponent implements AfterViewInit, OnDestroy {
    public searchTerm = "";
    public page = 1;

    public state: INovaFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        paginator: {
            // @ts-ignore: used for demo purposes
            total: undefined,
        },
    };

    public filters: any[];
    public selectedFilters: any[];

    @ViewChild("filteringPaginator") filteringPaginator: PaginatorComponent;
    @ViewChild("filteringSearch") filteringSearch: SearchComponent;

    private outputsSubscription: Subscription;

    constructor(public dataSourceService: LocalFilteringDataSource<ExampleItem>,
                public changeDetection: ChangeDetectorRef) {
        dataSourceService.setData(RANDOM_ARRAY);

        this.filters = ["regular", "dark", "light"];
        this.selectedFilters = [];
    }

    ngAfterViewInit() {
        this.dataSourceService.componentTree = {
            search: {
                componentInstance: this.filteringSearch,
            },
            paginator: {
                componentInstance: this.filteringPaginator,
            },
        };
        this.dataSourceService.applyFilters();
        this.outputsSubscription = this.dataSourceService.outputsSubject.subscribe((data: INovaFilteringOutputs) => {
            this.state = data;
            if (data && data.paginator && data.paginator.reset) {
                this.filteringPaginator.page = 1;
            }
            this.changeDetection.detectChanges();
        });
    }

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }

    public onSearch(value: string) {
        this.dataSourceService.applyFilters();
    }

    public changePagination() {
        this.dataSourceService.applyFilters();
    }

    public applyFilters() {
        this.dataSourceService.applyFilters();
    }
}
