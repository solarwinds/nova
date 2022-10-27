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
    QueryList,
    ViewChild,
    ViewChildren,
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
    PopoverComponent,
    PopoverOverlayPosition,
    VirtualViewportManager,
} from "@nova-ui/bits";

import { FilterGroupComponent } from "./filter-group/filter-group.component";
import { IFilterGroupItem } from "./filter-group/public-api";
import { FilteredViewTableWithVirtualScrollSelectionDataSource } from "./filtered-view-table-with-virtual-scroll-selection-data-source.service";
import { IFilterable, IServer, ServerStatus } from "./types";

@Component({
    selector: "app-filtered-view-table-with-virtual-scroll-selection",
    styleUrls: [
        "./filtered-view-table-with-virtual-scroll-selection.component.less",
    ],
    templateUrl:
        "./filtered-view-table-with-virtual-scroll-selection.component.html",
    providers: [
        VirtualViewportManager,
        {
            provide: DataSourceService,
            useClass: FilteredViewTableWithVirtualScrollSelectionDataSource,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilteredViewTableWithVirtualScrollSelectionComponent
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
    @ViewChild(PopoverComponent) private popover: PopoverComponent;
    @ViewChild("child") private child: IFilterable;
    @ViewChildren(FilterGroupComponent)
    private filterGroups: QueryList<FilterGroupComponent>;

    constructor(
        // inject dataSource providers only to share the same instance
        // using DI descendants inheritance with child components
        @Inject(DataSourceService)
        private dataSource: FilteredViewTableWithVirtualScrollSelectionDataSource<IServer>,
        private cd: ChangeDetectorRef
    ) {}

    public ngAfterViewInit() {
        this.outputsSubscription = this.dataSource.outputsSubject.subscribe(
            (data: INovaFilteringOutputs) => {
                this.recalculateCounts(data);
                this.cd.detectChanges();
            }
        );
    }

    public async applyFilters() {
        await this.child.applyFilters();
        this.updateChips();
    }

    public onChipsOverflow(source: IChipsItemsSource) {
        this.overflowSource = source;
        const reducer = (accumulator: number, currentValue: IChipsGroup) =>
            accumulator + currentValue.items.length;
        this.overflowCounter =
            (this.overflowSource.flatItems?.length || 0) +
            (this.overflowSource.groupedItems?.reduce(reducer, 0) || 0);
        this.popover?.updatePosition();
    }

    public async onClear(event: { item: IChipsItem; group?: IChipsGroup }) {
        if (event.group) {
            _pull(event.group.items || [], event.item);
        } else {
            _pull(this.chipsDataSource.flatItems || [], event.item);
        }
        const group = this.filterGroups.find(
            (i) => event.group?.id === i.filterGroupItem.id
        );
        group?.deselectFilterItemByValue(event.item.label);
    }

    public onClearAll(e: MouseEvent) {
        this.chipsDataSource.groupedItems = [];
        this.popover?.onClick(e);
        this.filterGroups.forEach((i) => i.deselectAllFilterItems());
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

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }
}
