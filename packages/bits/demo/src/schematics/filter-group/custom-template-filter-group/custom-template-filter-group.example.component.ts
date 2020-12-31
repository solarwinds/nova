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

import { IFilterGroupItem, IFilterGroupOption } from "./public-api";

interface ExampleItem {
    color: string;
    status: string;
}

interface CustomTemplateFilterGroupOption extends IFilterGroupOption {
    icon: string;
}

interface CustomTemplateFilterGroupItem extends IFilterGroupItem {
    count: number;
    allFilterOptions: CustomTemplateFilterGroupOption[];
}

const RANDOM_ARRAY = [
    {color: "regular-azure", status: "Critical"},
    {color: "regular-black", status: "Warning"},
    {color: "regular-blue", status: "Up"},
    {color: "regular-yellow", status: "Critical"},
    {color: "regular-yellow", status: "Warning"},
    {color: "regular-black", status: "Up"},
    {color: "regular-blue", status: "Up"},
    {color: "regular-azure", status: "Up"},
    {color: "regular-blue", status: "Up"},
    {color: "regular-azure", status: "Critical"},
];

@Component({
    selector: "app-custom-template-filter-group-composite-example",
    templateUrl: "custom-template-filter-group.example.component.html",
    providers: [{
        provide: DataSourceService,
        useClass: LocalFilteringDataSource,
    }],
})
export class CustomTemplateFilterGroupExampleComponent implements AfterViewInit, OnDestroy {
    public filterGroupItems: CustomTemplateFilterGroupItem[] = [
        {
            id: "color",
            title: "Color",
            count: 4,
            allFilterOptions: [
                {
                    icon: "copy",
                    value: "azure",
                    displayValue: "Azure",
                }, {
                    icon: "clock",
                    value: "black",
                    displayValue: "Black",
                }, {
                    icon: "status_up",
                    value: "blue",
                    displayValue: "Blue",
                }, {
                    icon: "signal-0",
                    value: "yellow",
                    displayValue: "Yellow",
                },
            ],
            selectedFilterValues: ["azure"],
        }, {
            id: "status",
            title: "Status",
            count: 3,
            allFilterOptions: [
                {
                    icon: "status_warning",
                    value: "warning",
                    displayValue: "Warning",
                }, {
                    icon: "status_critical",
                    value: "critical",
                    displayValue: "Critical",
                },
                {
                    icon: "status_up",
                    value: "up",
                    displayValue: "Up",
                },
            ],
            selectedFilterValues: ["critical"],
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

    public changeFilters(event: IFilterGroupItem) {
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

    ngOnDestroy() {
        if (this.outputsSubscription) {
            this.outputsSubscription.unsubscribe();
        }
    }
}
