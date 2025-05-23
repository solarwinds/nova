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
    Component,
    Inject,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { Subscription } from "rxjs";

import {
    DataSourceService,
    IFilter,
    IMenuItem,
    IMultiFilterMetadata,
    INovaFilteringOutputs,
    ISorterChanges,
    LocalFilteringDataSource,
    PaginatorComponent,
    RepeatComponent,
    SearchComponent,
    SorterComponent,
    SorterDirection,
} from "@nova-ui/bits";

interface ExampleItem {
    color: string;
    status: string;
}

interface IconsOptions {
    [key: string]: {
        iconName: string;
    };
}

interface ExpanderOptions {
    expanded: boolean;
    header: string;
}

interface PanelOptions {
    panelMode: string;
    heading: string;
}

const RANDOM_ARRAY = [
    { color: "regular-blue", status: "Critical" },
    { color: "regular-green", status: "Warning" },
    { color: "regular-yellow", status: "Up" },
    { color: "regular-cyan ", status: "Critical" },
    { color: "regular-magenta", status: "Warning" },
    { color: "regular-black", status: "Up" },
    { color: "regular-orange", status: "Up" },
    { color: "regular-rose", status: "Up" },
    { color: "regular-violet", status: "Up" },
    { color: "regular-azure", status: "Critical" },
    { color: "dark-blue", status: "Warning" },
    { color: "dark-green", status: "Up" },
    { color: "dark-yellow", status: "Critical" },
    { color: "dark-cyan ", status: "Warning" },
    { color: "dark-magenta", status: "Up" },
    { color: "dark-black", status: "Critical" },
    { color: "dark-orange", status: "Warning" },
    { color: "dark-rose", status: "Up" },
    { color: "dark-violet", status: "Critical" },
    { color: "dark-azure", status: "Warning" },
    { color: "light-blue", status: "Up" },
    { color: "light-green", status: "Critical" },
    { color: "light-yellow", status: "Warning" },
    { color: "light-cyan", status: "Up" },
    { color: "light-magenta", status: "Critical" },
    { color: "light-black", status: "Warning" },
    { color: "light-orange", status: "Up" },
    { color: "light-rose", status: "Critical" },
    { color: "light-violet", status: "Warning" },
    { color: "light-azure", status: "Up" },
];

/**
 * TODO: Remove in  - NUI-5835
 * @deprecated
 */
@Component({
    selector: "nui-deprecated-client-side-filtering-data-source-example",
    templateUrl: "./client-side-filtering.example.component.html",
    styleUrls: ["./client-side-filtering.example.component.less"],
    providers: [
        {
            provide: DataSourceService,
            useClass: LocalFilteringDataSource,
        },
    ],
    standalone: false,
})
export class DepreacatedDataSourceClientSideFilteringExampleComponent
    implements AfterViewInit, OnDestroy
{
    public panelOptions: PanelOptions = {
        panelMode: "collapsible",
        heading: "Filters",
    };

    public colorExpanderOptions: ExpanderOptions = {
        expanded: true,
        header: "Colors",
    };

    public statusExpanderOptions: ExpanderOptions = {
        expanded: true,
        header: "Statuses",
    };

    public statusIcons: IconsOptions = {
        Critical: { iconName: "status_critical" },
        Warning: { iconName: "status_warning" },
        Up: { iconName: "status_up" },
    };

    public colorIcons: IconsOptions = {
        azure: { iconName: "record" },
        black: { iconName: "status_up" },
        blue: { iconName: "signal-0" },
        cyan: { iconName: "signal-0" },
        green: { iconName: "signal-1" },
        orange: { iconName: "signal-2" },
        rose: { iconName: "signal-0" },
        violet: { iconName: "signal-0" },
        yellow: { iconName: "signal-0" },
        brown: { iconName: "signal-0" },
    };

    public allStatuses: string[] = ["Warning", "Critical", "Up"];

    public allColors: string[] = [
        "azure",
        "black",
        "blue",
        "cyan",
        "green",
        "orange",
        "rose",
        "violet",
        "yellow",
        "brown",
    ];

    public selectedColorTypes: string[] = ["Up"];

    public selectedCriteriaColors: string[] = ["azure"];

    public readonly sorterItems: IMenuItem[] = [
        {
            title: $localize`Color`,
            value: "color",
        },
    ];

    public readonly initialSortDirection = SorterDirection.ascending;
    public sortBy = this.sorterItems[0].value;

    // By convention this is the object that will contain results of filtering, it should contain the same keys as registered components
    // We're using this object to bind to template items/paginator/filtering data
    public filteringState: INovaFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        color: [], // This will contain objects like {}
        status: [],
        paginator: {
            // @ts-ignore: used for demo purposes
            total: undefined,
        },
    };
    public page: number = 1;
    public searchTerm: string = "";
    public chosenColors: string[] = [];
    public chosenStatuses: string[] = [];

    @ViewChild("filteringSearch") filteringSearch: SearchComponent;
    @ViewChild("filteringSorter") filteringSorter: SorterComponent;
    @ViewChild("filteringRepeat") filteringRepeat: RepeatComponent;
    @ViewChild("filteringPaginator") filteringPaginator: PaginatorComponent;

    private outputsSubscription: Subscription;

    constructor(
        @Inject(DataSourceService)
        public dataSourceService: DataSourceService<ExampleItem>
    ) {
        (
            this.dataSourceService as LocalFilteringDataSource<ExampleItem>
        ).setData(RANDOM_ARRAY);
    }

    public ngAfterViewInit(): void {
        this.chosenColors = [...this.selectedCriteriaColors];
        this.chosenStatuses = [...this.selectedColorTypes];
        this.dataSourceService.registerComponent({
            ...this.registerComponents(),
        });

        this.dataSourceService.applyFilters();
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.filteringState = data;
                    if (data && data.paginator && data.paginator.reset) {
                        // This allows to go back to first page after filtering/search/sorting has changed
                        this.filteringPaginator.goToPage(1);
                    }
                }
            );
    }

    public ngOnDestroy(): void {
        if (this.outputsSubscription) {
            this.outputsSubscription.unsubscribe();
        }
    }

    private registerComponents = () => ({
        // Here we're registering color and status filters
        color: {
            componentInstance: {
                getFilters: () =>
                    <IFilter<string[], IMultiFilterMetadata>>{
                        type: "string[]",
                        value: this.chosenColors,
                        metadata: {
                            allCategories: this.allColors,
                        },
                    },
            },
        },
        status: {
            componentInstance: {
                getFilters: () =>
                    <IFilter<string[], IMultiFilterMetadata>>{
                        type: "string[]",
                        value: this.chosenStatuses,
                        metadata: {
                            allCategories: this.allStatuses,
                        },
                    },
            },
        },
        search: {
            componentInstance: this.filteringSearch,
        },
        sorter: {
            componentInstance: this.filteringSorter,
        },
        paginator: {
            componentInstance: this.filteringPaginator,
        },
    });

    public applyFilters(): void {
        this.dataSourceService.applyFilters();
    }

    public onSorterAction(changes: ISorterChanges): void {
        this.sortBy = changes.newValue.sortBy;
        this.dataSourceService.applyFilters();
    }

    public onSelectedCriteriaChange($event: string[]): void {
        this.chosenColors = $event;
        this.dataSourceService.applyFilters();
    }

    public onSelectedColorTypesChange($event: string[]): void {
        this.chosenStatuses = $event;
        this.dataSourceService.applyFilters();
    }

    public isColorCriteriaChecked(color: string): boolean {
        return this.selectedCriteriaColors.indexOf(color) > -1;
    }

    public isColorTypeChecked(status: string): boolean {
        return this.selectedColorTypes.indexOf(status) > -1;
    }

    public hasItems(): boolean {
        return !_isEmpty(_get(this, "filteringState.repeat.itemsSource"));
    }

    public showStatus(status: string): string {
        return this.filteringState.status
            ? this.filteringState.status[status]
            : this.filteringState.status;
    }

    public showColor(color: string): string {
        return this.filteringState.color
            ? this.filteringState.color[color]
            : this.filteringState.color;
    }

    public isGreaterThanZero(amount: number): boolean {
        return amount > 0;
    }
}
