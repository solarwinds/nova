import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

import {
    ClientSideDataSource,
    INovaFilteringOutputs,
    PaginatorComponent,
    SearchComponent,
    SorterComponent,
} from "@nova-ui/bits";

const INITIAL_ARRAY = [
    { color: "regular-blue" },
    { color: "regular-green" },
    { color: "regular-yellow" },
    { color: "regular-cyan" },
    { color: "regular-magenta" },
    { color: "regular-black" },
    { color: "dark-blue" },
    { color: "dark-green" },
    { color: "dark-yellow" },
    { color: "dark-cyan" },
    { color: "dark-magenta" },
    { color: "light-blue" },
    { color: "light-green" },
    { color: "light-yellow" },
    { color: "light-cyan" },
    { color: "light-magenta" },
];

@Component({
    selector: "nui-client-side-delayed-data-source-example",
    providers: [ClientSideDataSource],
    templateUrl: "./client-side-delayed.example.component.html",
})
export class DataSourceClientSideDelayedExampleComponent
    implements AfterViewInit, OnDestroy
{
    public searchTerm = "";
    public page = 1;
    public sorter = {
        columns: ["color", "red", "green", "blue"],
        sortedColumn: "color",
        direction: "asc",
    };

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

    private delayActionSubject: Subject<any> = new Subject();
    private outputsSubscription: Subscription;

    @ViewChild("filteringPaginator") filteringPaginator: PaginatorComponent;
    @ViewChild("filteringSearch") filteringSearch: SearchComponent;
    @ViewChild("filteringSorter") filteringSorter: SorterComponent;

    constructor(
        public dataSourceService: ClientSideDataSource<any>,
        public changeDetection: ChangeDetectorRef
    ) {
        dataSourceService.setData(INITIAL_ARRAY);

        this.filters = ["regular", "dark", "light"];
        this.selectedFilters = [];
    }

    async ngAfterViewInit() {
        this.dataSourceService.componentTree = {
            search: {
                componentInstance: this.filteringSearch,
            },
            paginator: {
                componentInstance: this.filteringPaginator,
            },
        };
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.state = data;
                    this.changeDetection.detectChanges();
                }
            );
        this.delayActionSubject.pipe(debounceTime(500)).subscribe(() => {
            this.dataSourceService.applyFilters();
        });

        await this.dataSourceService.applyFilters();
    }

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }

    public onSearch() {
        this.delayActionSubject.next();
    }

    public async changePagination() {
        await this.dataSourceService.applyFilters();
    }
}
