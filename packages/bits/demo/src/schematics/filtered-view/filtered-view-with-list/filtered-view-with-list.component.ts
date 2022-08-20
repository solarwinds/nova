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
import _pull from "lodash/pull";
import { Subscription } from "rxjs";

import { FilterGroupComponent } from "./filter-group/filter-group.component";
import { IFilterGroupItem } from "./filter-group/public-api";
import { LOCAL_DATA } from "./filtered-view-with-list-data";
import { IFilterable, IServer, ServerStatus } from "./types";

@Component({
    selector: "app-filtered-view-with-list",
    styleUrls: ["./filtered-view-with-list.component.less"],
    templateUrl: "./filtered-view-with-list.component.html",
    providers: [
        {
            provide: DataSourceService,
            useClass: LocalFilteringDataSource,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilteredViewWithListComponent implements AfterViewInit, OnDestroy {
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
        private dataSource: LocalFilteringDataSource<IServer>,
        private cd: ChangeDetectorRef
    ) {
        // here we use ClientSideDataSource since the data we're working with is static (RANDOM_ARRAY)
        // if you have a dynamic data source, you need to extend DataSourceService for your custom filtering behavior
        this.dataSource.setData(LOCAL_DATA);
    }

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
