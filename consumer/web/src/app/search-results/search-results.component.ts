import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { IFilteringOutputs, PaginatorComponent, SorterComponent, SorterDirection } from "@solarwinds/nova-bits";
import { Subscription } from "rxjs";

import { DataSourceFilterService } from "../services/data-source-filter.service";

@Component({
    selector: "rd-search-results",
    templateUrl: "./search-results.component.html",
    providers: [DataSourceFilterService],
})
export class SearchResultsComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild("filteringPaginator", { static: true }) filteringPaginator: PaginatorComponent;
    @ViewChild("sorterRef", { static: true }) sorterRef: SorterComponent;

    public state: IFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        paginator: {
            total: 0,
        },
    };

    public searchText$: Subscription;
    public searchText = "";
    public page = 1;

    public sorter = {
        items: ["date", "title"], // TODO: populate from data source
        sortDirection: SorterDirection.original,
    };

    constructor(private route: ActivatedRoute,
                public dataSourceFilterService: DataSourceFilterService<IFilteringOutputs>) {
    }

    ngOnInit() {
    }

    async ngAfterViewInit() {
        this.dataSourceFilterService.componentTree = {
            search: {
                componentInstance: {
                    getFilters: () => ({type: "string", value: this.searchText}),
                },
            },
            paginator: {componentInstance: this.filteringPaginator},
            sorter: {componentInstance: this.sorterRef},
        };

        this.dataSourceFilterService.outputsSubject
            .subscribe((data: IFilteringOutputs) => {
                this.state = data;
                if (data && data.paginator && data.paginator.reset) {
                    this.page = 1;
                }
            });

        this.searchText$ = this.route.paramMap.subscribe(async (paramMap: ParamMap) => {
            this.searchText = paramMap.get("globalSearchQuery");

            await this.dataSourceFilterService.applyFilters();
        });
    }

    ngOnDestroy() {
        if (this.searchText$) {
            this.searchText$.unsubscribe();
        }
    }

}
