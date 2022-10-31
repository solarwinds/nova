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

import { AfterViewInit, Component, Inject, OnDestroy } from "@angular/core";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { Subscription } from "rxjs";

import {
    DataSourceService,
    DialogService,
    INovaFilteringOutputs,
    LocalFilteringDataSource,
} from "@nova-ui/bits";

import { FilterGroupCompositeDialogComponent } from "./filter-group-dialog/filter-group-dialog.component";
import { FilterGroupService } from "./filter-group.service";
import { IFilterGroupItem } from "./public-api";

interface ExampleItem {
    color: string;
    name: string;
}

const RANDOM_ARRAY = [
    { color: "yellow", name: "banana" },
    { color: "orange", name: "orange" },
    { color: "violet", name: "plum" },
    { color: "blue", name: "blueberry" },
    { color: "brown", name: "potato" },
    { color: "red", name: "apple" },
    { color: "green", name: "pear" },
    { color: "black", name: "blackcurrant" },
    { color: "white", name: "coconut" },
    { color: "magenta", name: "mulberry" },
    { color: "apricot", name: "peach" },
    { color: "olive", name: "olive" },
    { color: "carmine", name: "grapefruit" },
    { color: "coral", name: "pomegranate" },
    { color: "corn", name: "corn" },
];

@Component({
    selector: "app-dialog-filter-group-composite-example",
    templateUrl: "dialog-filter-group.example.component.html",
    providers: [
        {
            provide: DataSourceService,
            useClass: LocalFilteringDataSource,
        },
    ],
})
export class DialogFilterGroupExampleComponent
    implements AfterViewInit, OnDestroy
{
    public filterGroupItems: IFilterGroupItem[] = [
        {
            id: "color",
            title: "Color",
            expanded: true,
            allFilterOptions: [
                {
                    value: "yellow",
                    displayValue: "Yellow",
                    count: 1,
                },
                {
                    value: "orange",
                    displayValue: "Orange",
                    count: 1,
                },
                {
                    value: "violet",
                    displayValue: "Violet",
                    count: 1,
                },
                {
                    value: "blue",
                    displayValue: "Blue",
                    count: 1,
                },
                {
                    value: "brown",
                    displayValue: "Brown",
                    count: 1,
                },
                {
                    value: "red",
                    displayValue: "Red",
                    count: 1,
                },
                {
                    value: "green",
                    displayValue: "Green",
                    count: 1,
                },
                {
                    value: "black",
                    displayValue: "Black",
                    count: 1,
                },
                {
                    value: "white",
                    displayValue: "White",
                    count: 1,
                },
                {
                    value: "magenta",
                    displayValue: "Magenta",
                    count: 1,
                },
                {
                    value: "apricot",
                    displayValue: "Apricot",
                    count: 1,
                },
                {
                    value: "olive",
                    displayValue: "Olive",
                    count: 1,
                },
                {
                    value: "carmine",
                    displayValue: "Carmine",
                    count: 1,
                },
                {
                    value: "coral",
                    displayValue: "Coral",
                    count: 1,
                },
                {
                    value: "corn",
                    displayValue: "Corn",
                    count: 1,
                },
            ],
            selectedFilterValues: [],
            itemsToDisplay: 10,
        },
        {
            id: "name",
            title: "Fruits and Vegetables",
            expanded: false,
            allFilterOptions: [
                {
                    value: "banana",
                    displayValue: "Banana",
                    count: 1,
                },
                {
                    value: "orange",
                    displayValue: "Orange",
                    count: 1,
                },
                {
                    value: "plum",
                    displayValue: "Plum",
                    count: 1,
                },
                {
                    value: "blueberry",
                    displayValue: "Blueberry",
                    count: 1,
                },
                {
                    value: "potato",
                    displayValue: "Potato",
                    count: 1,
                },
                {
                    value: "apple",
                    displayValue: "Apple",
                    count: 1,
                },
                {
                    value: "pear",
                    displayValue: "Pear",
                    count: 1,
                },
                {
                    value: "blackcurrant",
                    displayValue: "Blackcurrant",
                    count: 1,
                },
                {
                    value: "coconut",
                    displayValue: "Coconut",
                    count: 1,
                },
                {
                    value: "mulberry",
                    displayValue: "Mulberry",
                    count: 1,
                },
                {
                    value: "peach",
                    displayValue: "Peach",
                    count: 1,
                },
                {
                    value: "olive",
                    displayValue: "Olive",
                    count: 1,
                },
                {
                    value: "grapefruit",
                    displayValue: "Grapefruit",
                    count: 1,
                },
                {
                    value: "pomegranate",
                    displayValue: "Pomegranate",
                    count: 1,
                },
                {
                    value: "corn",
                    displayValue: "Corn",
                    count: 1,
                },
            ],
            selectedFilterValues: [],
            itemsToDisplay: 10,
        },
    ];

    public filteringState: INovaFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        color: [],
        name: [],
    };

    private outputsSubscription: Subscription;
    private dialogSubscription: Subscription;

    constructor(
        @Inject(DataSourceService)
        public dataSourceService: DataSourceService<ExampleItem>,
        @Inject(DialogService) private dialogService: DialogService,
        private filterGroupService: FilterGroupService
    ) {
        (
            this.dataSourceService as LocalFilteringDataSource<ExampleItem>
        ).setData(RANDOM_ARRAY);
    }

    ngAfterViewInit(): void {
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

    public changeFilters(event: IFilterGroupItem) {
        this.dataSourceService.applyFilters();
    }

    public hasItems(): boolean {
        return !_isEmpty(_get(this, "filteringState.repeat.itemsSource"));
    }

    public handleFilterDialog(filterGroupItem: IFilterGroupItem) {
        const dialogRef = this.dialogService.open(
            FilterGroupCompositeDialogComponent
        );
        dialogRef.componentInstance.title = "Filter dialog";
        dialogRef.componentInstance.itemPickerOptions =
            filterGroupItem.allFilterOptions;
        dialogRef.componentInstance.selectedValues =
            filterGroupItem.selectedFilterValues;
        this.dialogSubscription =
            dialogRef.componentInstance.dialogClosed.subscribe(
                (selectedValues: string[]) => {
                    filterGroupItem.selectedFilterValues = selectedValues;
                    filterGroupItem =
                        this.filterGroupService.appendHiddenFilters(
                            filterGroupItem
                        );
                    this.dataSourceService.applyFilters();
                }
            );
    }

    private recalculateCounts(filterData: INovaFilteringOutputs) {
        this.filterGroupItems.forEach((filterGroupItem) => {
            filterGroupItem.allFilterOptions.forEach((filterOption) => {
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
