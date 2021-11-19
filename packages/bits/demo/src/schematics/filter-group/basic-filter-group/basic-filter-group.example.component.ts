import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
} from "@angular/core";
import {
    DataSourceService,
    INovaFilteringOutputs,
    LocalFilteringDataSource,
} from "@nova-ui/bits";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { Subscription } from "rxjs";

import { IFilterGroupItem } from "./public-api";

interface ExampleItem {
    color: string;
    status: string;
}

const RANDOM_ARRAY = [
    { color: "regular-azure", status: "Critical" },
    { color: "regular-black", status: "Warning" },
    { color: "regular-blue", status: "Up" },
    { color: "regular-yellow", status: "Critical" },
    { color: "regular-yellow", status: "Warning" },
    { color: "regular-black", status: "Up" },
    { color: "regular-blue", status: "Up" },
    { color: "regular-azure", status: "Up" },
    { color: "regular-blue", status: "Up" },
    { color: "regular-azure", status: "Critical" },
];

@Component({
    selector: "app-basic-filter-group-composite-example",
    templateUrl: "basic-filter-group.example.component.html",
    providers: [{
        provide: DataSourceService,
        useClass: LocalFilteringDataSource,
    }],
})
export class BasicFilterGroupExampleComponent implements AfterViewInit, OnDestroy {
    public filterGroupItems: IFilterGroupItem[] = [
        {
            id: "color",
            title: "Color",
            expanded: true,
            allFilterOptions: [
                {
                    value: "azure",
                    displayValue: "Azure FilterGroup Basic Example",
                    count: 3,
                }, {
                    value: "black",
                    displayValue: "Black",
                    count: 2,
                }, {
                    value: "blue",
                    displayValue: "Blue FilterGroup Basic Example",
                    count: 3,
                }, {
                    value: "yellow",
                    displayValue: "Yellow",
                    count: 2,
                },
            ],
            selectedFilterValues: [],
        }, {
            id: "status",
            title: "Status",
            allFilterOptions: [
                {
                    value: "warning",
                    displayValue: "Warning",
                    count: 2,
                }, {
                    value: "critical",
                    displayValue: "Critical",
                    count: 2,
                },
                {
                    value: "up",
                    displayValue: "Up",
                    count: 5,
                },
            ],
            selectedFilterValues: [],
        },
        {
            id: "vendor",
            title: "Vendors",
            allFilterOptions: [],
            selectedFilterValues: [],
        },
    ];

    public filteringState: INovaFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        color: [],
        status: [],
    };

    private outputsSubscription: Subscription;

    constructor(@Inject(DataSourceService) public dataSourceService: DataSourceService<ExampleItem>) {
        (this.dataSourceService as LocalFilteringDataSource<ExampleItem>).setData(RANDOM_ARRAY);
    }

    ngAfterViewInit(): void {
        this.outputsSubscription = this.dataSourceService.outputsSubject.subscribe((data: INovaFilteringOutputs) => {
            this.filteringState = data;
            // get counts of filters
            this.recalculateCounts(data);
        });
        this.dataSourceService.applyFilters();
    }

    public changeFilters(event: IFilterGroupItem): void {
        this.dataSourceService.applyFilters();
    }

    public hasItems(): boolean {
        return !_isEmpty(_get(this, "filteringState.repeat.itemsSource"));
    }

    private recalculateCounts(filterData: INovaFilteringOutputs) {
        this.filterGroupItems.forEach(filterGroupItem => {
            filterGroupItem.allFilterOptions.forEach(filterOption => {
                const counts = filterData[filterGroupItem.id];
                filterOption.count = counts[filterOption.value];
            });
        });
    }

    ngOnDestroy(): void {
        if (this.outputsSubscription) {
            this.outputsSubscription.unsubscribe();
        }
    }
}
