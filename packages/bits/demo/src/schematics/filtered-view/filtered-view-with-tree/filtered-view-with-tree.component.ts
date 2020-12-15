import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    QueryList,
    ViewChild,
    ViewChildren,
} from "@angular/core";
import {
    DataSourceService,
    IChipsGroup,
    IChipsItem,
    IChipsItemsSource,
    PopoverComponent,
    PopoverOverlayPosition,
} from "@nova-ui/bits";
import _pull from "lodash/pull";

import { FilterGroupComponent } from "./filter-group/filter-group.component";
import { IFilterGroupItem } from "./filter-group/public-api";
import {FilteredViewWithTreeDataSource} from "./filtered-view-with-tree-data-source.service";
import {
    IFilterable,
    IServer,
} from "./types";

@Component({
    selector: "app-filtered-view-with-tree",
    styleUrls: ["./filtered-view-with-tree.component.less"],
    templateUrl: "./filtered-view-with-tree.component.html",
    providers: [
        {
            provide: DataSourceService,
            useClass: FilteredViewWithTreeDataSource,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilteredViewWithTreeComponent implements AfterViewInit {
    public filterGroupItems: IFilterGroupItem[] = [
        {
            id: "subregion",
            title: "Subregion",
            allFilterOptions: [
                {
                    value: "Caribbean",
                    displayValue: "Caribbean",
                },
                {
                    value: "South America",
                    displayValue: "South America",
                },
                {
                    value: "Central America",
                    displayValue: "Central America",
                },
                {
                    value: "Northern America",
                    displayValue: "Northern America",
                },
            ],
            selectedFilterValues: [],
        },
        {
            id: "language",
            title: "Language",
            allFilterOptions: [
                {
                    value: "English",
                    displayValue: "English",
                },
                {
                    value: "Dutch",
                    displayValue: "Dutch",
                },
                {
                    value: "French",
                    displayValue: "French",
                },
                {
                    value: "Spanish",
                    displayValue: "Spanish",
                },
            ],
            selectedFilterValues: [],
        },

        {
            id: "currency",
            title: "Currency",
            allFilterOptions: [
                {
                    value: "USD",
                    displayValue: "USD",
                },
                {
                    value: "EUR",
                    displayValue: "EUR",
                },
                {
                    value: "CAD",
                    displayValue: "CAD",
                },
                {
                    value: "MXN",
                    displayValue: "MXN",
                },
            ],
            selectedFilterValues: [],
        },

    ];

    public chipsDataSource: IChipsItemsSource = {groupedItems: [], flatItems: []};
    public overflowCounter: number;
    public overflowSource: IChipsItemsSource;
    public overflowPopoverPosition: PopoverOverlayPosition[] = [PopoverOverlayPosition.bottomLeft, PopoverOverlayPosition.topLeft];
    @ViewChild(PopoverComponent) private popover: PopoverComponent;
    @ViewChild("child") private child: IFilterable;
    @ViewChildren(FilterGroupComponent) private filterGroups: QueryList<FilterGroupComponent>;

    constructor(
        // inject dataSource providers only to share the same instance
        // using DI descendants inheritance with child components
        @Inject(DataSourceService) private dataSource: FilteredViewWithTreeDataSource<IServer>,
        private cd: ChangeDetectorRef
    ) {
    }

    public ngAfterViewInit() {
        this.dataSource.applyFilters();
    }

    public async applyFilters() {
        await this.child.applyFilters();
        this.updateChips();
    }

    public onChipsOverflow(source: IChipsItemsSource) {
        this.overflowSource = source;
        const reducer = (accumulator: number, currentValue: IChipsGroup) => accumulator + currentValue.items.length;
        this.overflowCounter = (this.overflowSource.flatItems?.length || 0) + (this.overflowSource.groupedItems?.reduce(reducer, 0) || 0);
        this.popover?.updatePosition();
    }

    public async onClear(event: { item: IChipsItem, group?: IChipsGroup }) {
        if (event.group) {
            _pull(event.group.items || [], event.item);
        } else {
            _pull(this.chipsDataSource.flatItems || [], event.item);
        }
        const group = this.filterGroups.find(i => event.group?.id === i.filterGroupItem.id);
        group?.deselectFilterItemByValue(event.item.label);
    }

    public onClearAll(e: MouseEvent) {
        this.chipsDataSource.groupedItems = [];
        this.popover?.onClick(e);
        this.filterGroups.forEach(i => i.deselectAllFilterItems());
    }

    private updateChips() {
        this.chipsDataSource.groupedItems = this.filterGroupItems.map(i => (
            {
                id: i.id,
                label: i.title,
                items: i.selectedFilterValues.map(selected => ({label: selected})),
            }
        ));
        this.cd.markForCheck();
    }
}
