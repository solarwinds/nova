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

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  viewChild,
  viewChildren
} from "@angular/core";
import _pull from "lodash/pull";
import { Subscription } from "rxjs";

import {
    DataSourceService,
    IChipsGroup,
    IChipsItem,
    IChipsItemsSource,
    IFilteringOutputs,
    INovaFilteringOutputs,
    LocalFilteringDataSource,
    PopoverComponent,
    PopoverOverlayPosition,
} from "@nova-ui/bits";

import { FilterGroupComponent } from "./filter-group/filter-group.component";
import { IFilterGroupItem } from "./filter-group/public-api";
import { LOCAL_DATA } from "./filtered-view-with-table-data";
import { IFilterable, IServer, ServerStatus } from "./types";

@Component({
    selector: "app-filtered-view-with-table",
    styleUrls: ["./filtered-view-with-table.component.less"],
    templateUrl: "./filtered-view-with-table.component.html",
    providers: [
        {
            provide: DataSourceService,
            useClass: LocalFilteringDataSource,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class FilteredViewWithTableComponent
    implements AfterViewInit, OnDestroy
{
    public filterGroupItems: IFilterGroupItem[] = [
        {
            id: "status",
            title: "Status",
            expanded: true,
            allFilterOptions: [
                {
                    value: ServerStatus.down,
                    displayValue: "Down",
                },
                {
                    value: ServerStatus.active,
                    displayValue: "Active",
                },
            ],
            selectedFilterValues: [],
        },
        {
            id: "location",
            title: "Location",
            allFilterOptions: [
                {
                    value: "Austin",
                    displayValue: "Austin",
                },
                {
                    value: "Brno",
                    displayValue: "Brno",
                },
                {
                    value: "Bucharest",
                    displayValue: "Bucharest",
                },
                {
                    value: "Kyiv",
                    displayValue: "Kyiv",
                },
                {
                    value: "London",
                    displayValue: "London",
                },
            ],
            selectedFilterValues: [],
        },
    ];

    public chipsDataSource: IChipsItemsSource = {
        groupedItems: [],
        flatItems: [],
    };
    public overflowCounter: number;
    public overflowSource: IChipsItemsSource;
    public overflowPopoverPosition: PopoverOverlayPosition[] = [
        PopoverOverlayPosition.bottomLeft,
        PopoverOverlayPosition.topLeft,
    ];
    private outputsSubscription: Subscription;
    private readonly popover = viewChild.required(PopoverComponent);
    private readonly child = viewChild.required<IFilterable>("child");
    private readonly filterGroups = viewChildren(FilterGroupComponent);

    constructor(
        // inject dataSource providers only to share the same instance
        // using DI descendants inheritance with child components
        @Inject(DataSourceService)
        private dataSource: LocalFilteringDataSource<IServer>,
        private cd: ChangeDetectorRef
    ) {
        // here we use ClientSideDataSource since the data we're working with is static (RANDOM_ARRAY)
        // if you have a dynamic data source, you need to extend DataSourceService for your custom filtering behavior
        this.dataSource.setData(LOCAL_DATA);
    }

    public ngAfterViewInit(): void {
        this.outputsSubscription = this.dataSource.outputsSubject.subscribe(
            (data: INovaFilteringOutputs) => {
                this.recalculateCounts(data);
                this.cd.detectChanges();
            }
        );
    }

    public async applyFilters(): Promise<void> {
        await this.child().applyFilters();
        this.updateChips();
    }

    public onChipsOverflow(source: IChipsItemsSource): void {
        this.overflowSource = source;
        const reducer = (accumulator: number, currentValue: IChipsGroup) =>
            accumulator + currentValue.items.length;
        this.overflowCounter =
            (this.overflowSource.flatItems?.length || 0) +
            (this.overflowSource.groupedItems?.reduce(reducer, 0) || 0);
        this.popover()?.updatePosition();
    }

    public async onClear(event: {
        item: IChipsItem;
        group?: IChipsGroup;
    }): Promise<void> {
        if (event.group) {
            _pull(event.group.items || [], event.item);
        } else {
            _pull(this.chipsDataSource.flatItems || [], event.item);
        }
        const group = this.filterGroups().find(
            (i) => event.group?.id === i.filterGroupItem.id
        );
        group?.deselectFilterItemByValue(event.item.label);
    }

    public onClearAll(e: MouseEvent): void {
        this.chipsDataSource.groupedItems = [];
        this.popover()?.onClick(e);
        this.filterGroups().forEach((i) => i.deselectAllFilterItems());
    }

    private updateChips() {
        this.chipsDataSource.groupedItems = this.filterGroupItems.map((i) => ({
            id: i.id,
            label: i.title,
            items: i.selectedFilterValues.map((selected) => ({
                label: selected,
            })),
        }));
        this.cd.markForCheck();
    }

    private recalculateCounts(filterData: IFilteringOutputs) {
        this.filterGroupItems.forEach((filterGroupItem) => {
            filterGroupItem.allFilterOptions.forEach((filterOption) => {
                const counts = filterData[filterGroupItem.id];
                filterOption.count = counts[filterOption.value] ?? 0;
            });
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubscription.unsubscribe();
    }
}
