import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import {
    ClientSideDataSource,
    INovaFilteringOutputs, PaginatorComponent, SearchComponent
} from "@nova-ui/bits";
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

@Component({
    selector: "nui-client-side-basic-data-source-example",
    providers: [ ClientSideDataSource ],
    templateUrl: "./client-side-basic.example.component.html",
})
export class DataSourceClientSideBasicExampleComponent implements AfterViewInit, OnDestroy {
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

    constructor(public dataSourceService: ClientSideDataSource<ExampleItem>,
                public changeDetection: ChangeDetectorRef) {
        dataSourceService.setData(RANDOM_ARRAY);

        this.filters = ["regular", "dark", "light"];
        this.selectedFilters = [];
    }

    async ngAfterViewInit() {
        this.dataSourceService.registerComponent({
            search: {
                componentInstance: this.filteringSearch,
            },
            paginator: {
                componentInstance: this.filteringPaginator,
            },
        });
        this.outputsSubscription = this.dataSourceService.outputsSubject.subscribe((data: INovaFilteringOutputs) => {
                this.state = data;
                this.changeDetection.detectChanges();
        });
        await this.dataSourceService.applyFilters();
    }

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }

    public async onSearch(value: string) {
        await this.dataSourceService.applyFilters();
    }

    public async changePagination() {
        await this.dataSourceService.applyFilters();
    }

    public async applyFilters() {
        await this.dataSourceService.applyFilters();
    }
}
