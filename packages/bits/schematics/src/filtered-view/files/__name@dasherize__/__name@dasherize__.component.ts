import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,<%
    if(chips) {%>
    QueryList,
    ViewChild,
    ViewChildren,<% } %>
} from "@angular/core";
import {
    DataSourceService,<%
    if(chips) {%>
    IChipsGroup,
    IChipsItem,
    IChipsItemsSource,<% } %>
    IFilteringOutputs,
    INovaFilteringOutputs,<%
    if (dataSource === "none" || dataSource === "clientSide") {%>
    LocalFilteringDataSource,<% } %><%
    if(chips) {%>
    PopoverComponent,
    PopoverOverlayPosition,<% } %><%
    if (pagingMode === "virtualScroll") { %>
    VirtualViewportManager,<% } %>
} from "@solarwinds/nova-bits";<%
if(chips) {%>
import _pull from "lodash/pull";<% } %>
import { Subscription } from "rxjs";
<% if(dataSource === "custom") {%>
import { <%= classify(name) %>DataSource } from "./<%= dasherize(name) %>-data-source.service";<% } %><%
if(chips) {%>
import { FilterGroupComponent } from "./filter-group/filter-group.component";<% } %>
import { IFilterGroupItem } from "./filter-group/public-api";<%
if (dataSource === "none" || dataSource === "clientSide") { %>
import { LOCAL_DATA } from "./<%= dasherize(name)%>-data";<% } %>
import {<%
    if (chips) {%>
    IFilterable,<% } %>
    IServer,
    ServerStatus,
} from "./types";<%
if (dataSource === "serverSide") { %>
import {
    <%= classify(name) %>DataSource,
} from "./<%= dasherize(name) %>-data-source.service";<% } %>

@Component({
    selector: "<%= selector %>",
    styleUrls: ["./<%= dasherize(name) %>.component.less"],
    templateUrl: "./<%= dasherize(name) %>.component.html",
    providers: [<% if (pagingMode === "virtualScroll") { %>
        VirtualViewportManager,<% } %>
        {
            provide: DataSourceService,
            useClass: <% if(dataSource === "none" || dataSource === "clientSide") {%>LocalFilteringDataSource<%
        } else {%><%= classify(name) %>DataSource<% } %>,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>Component implements AfterViewInit, OnDestroy {
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
        }, {
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
    <% if(chips) { %>
    public chipsDataSource: IChipsItemsSource = {groupedItems: [], flatItems: []};
    public overflowCounter: number;
    public overflowSource: IChipsItemsSource;
    public overflowPopoverPosition: PopoverOverlayPosition[] = [PopoverOverlayPosition.bottomLeft, PopoverOverlayPosition.topLeft];<% } %><%

    if(dataSource === "custom") {%>
    public isBusy = true;<% } %>
    private outputsSubscription: Subscription;<%
    if(chips) {%>
    @ViewChild(PopoverComponent) private popover: PopoverComponent;
    @ViewChild("child") private child: IFilterable;
    @ViewChildren(FilterGroupComponent) private filterGroups: QueryList<FilterGroupComponent>;<% } %>

    constructor(
        // inject dataSource providers only to share the same instance
        // using DI descendants inheritance with child components
        @Inject(DataSourceService) private dataSource: <%
        if (dataSource === "none") {%>LocalFiltering<% } else {%><%= classify(name) %><% } %>DataSource<IServer>,
        private cd: ChangeDetectorRef
    ) {<%
        if (dataSource === "clientSide" || dataSource === "none") {%>
        // here we use ClientSideDataSource since the data we're working with is static (RANDOM_ARRAY)
        // if you have a dynamic data source, you need to extend DataSourceService for your custom filtering behavior
        this.dataSource.setData(LOCAL_DATA);<% } %>
    }

    public ngAfterViewInit() {
        this.outputsSubscription = this.dataSource.outputsSubject.subscribe((data: INovaFilteringOutputs) => {<%
            if(dataSource === "custom") {%>this.isBusy = false;<% } %>
            this.recalculateCounts(data);
            this.cd.detectChanges();
        });
    }<%
    if(chips) {%>

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
    }<% } %>

    private recalculateCounts(filterData: IFilteringOutputs) {
        this.filterGroupItems.forEach(filterGroupItem => {
            filterGroupItem.allFilterOptions.forEach(filterOption => {
                const counts = filterData[filterGroupItem.id];
                filterOption.count = counts[filterOption.value] ?? 0;
            });
        });
    }

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }
}
