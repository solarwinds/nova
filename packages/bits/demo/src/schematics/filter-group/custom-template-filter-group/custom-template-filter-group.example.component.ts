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

import { AfterViewInit, Component, OnDestroy, inject } from "@angular/core";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { Subscription } from "rxjs";

import {
    DataSourceService,
    INovaFilteringOutputs,
    LocalFilteringDataSource,
} from "@nova-ui/bits";

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
    selector: "app-custom-template-filter-group-composite-example",
    templateUrl: "custom-template-filter-group.example.component.html",
    providers: [
        {
            provide: DataSourceService,
            useClass: LocalFilteringDataSource,
        },
    ],
    standalone: false,
})
export class CustomTemplateFilterGroupExampleComponent
    implements AfterViewInit, OnDestroy
{
    dataSourceService = inject<DataSourceService<ExampleItem>>(DataSourceService);

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
                },
                {
                    icon: "clock",
                    value: "black",
                    displayValue: "Black",
                },
                {
                    icon: "status_up",
                    value: "blue",
                    displayValue: "Blue",
                },
                {
                    icon: "signal-0",
                    value: "yellow",
                    displayValue: "Yellow",
                },
            ],
            selectedFilterValues: ["azure"],
        },
        {
            id: "status",
            title: "Status",
            count: 3,
            allFilterOptions: [
                {
                    icon: "status_warning",
                    value: "warning",
                    displayValue: "Warning",
                },
                {
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

    constructor() {
        (
            this.dataSourceService as LocalFilteringDataSource<ExampleItem>
        ).setData(RANDOM_ARRAY);
    }

    public ngAfterViewInit(): void {
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.filteringState = data;
                    // get counts of filters
                    this.recalculateCounts(data);
                }
            );
        this.dataSourceService.applyFilters();
    }

    public changeFilters(event: IFilterGroupItem): void {
        this.dataSourceService.applyFilters();
    }

    public hasItems(): boolean {
        return !_isEmpty(_get(this, "filteringState.repeat.itemsSource"));
    }

    private recalculateCounts(filterData: INovaFilteringOutputs) {
        this.filterGroupItems.forEach((filterGroupItem) => {
            filterGroupItem.allFilterOptions.forEach((filterOption) => {
                const counts = filterData[filterGroupItem.id];
                filterOption.count = counts[filterOption.value];
            });
        });
    }

    public ngOnDestroy(): void {
        if (this.outputsSubscription) {
            this.outputsSubscription.unsubscribe();
        }
    }
}
