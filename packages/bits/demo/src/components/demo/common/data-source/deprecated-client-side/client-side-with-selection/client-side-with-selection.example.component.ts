import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import {
    INovaFilteringOutputs, ListService, LocalFilteringDataSource, PaginatorComponent, RepeatComponent, RepeatSelectionMode, SearchComponent, SelectionType
} from "@solarwinds/nova-bits";
import isUndefined from "lodash/isUndefined";
import { Subscription } from "rxjs";

interface IExampleItem {
    color: string;
}

/**
 * @deprecated
 */
@Component({
    selector: "nui-deprecated-client-side-with-selection-example",
    providers: [LocalFilteringDataSource],
    templateUrl: "./client-side-with-selection.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepreacatedDataSourceWithSelectionExampleComponent implements AfterViewInit, OnDestroy {
    public searchTerm = "";
    public page = 1;

    public state: INovaFilteringOutputs = {};

    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
    @ViewChild(SearchComponent) search: SearchComponent;
    @ViewChild(RepeatComponent) repeat: RepeatComponent;

    private outputsSubscription: Subscription;

    constructor(public dataSourceService: LocalFilteringDataSource<IExampleItem>,
        public changeDetection: ChangeDetectorRef,
        private listService: ListService) {
        dataSourceService.setData(getData());
    }

    ngAfterViewInit() {
        this.dataSourceService.registerComponent({
            search: {
                componentInstance: this.search,
            },
            paginator: {
                componentInstance: this.paginator,
            },
            repeat: {
                componentInstance: this.repeat,
            },
        });

        this.outputsSubscription = this.dataSourceService.outputsSubject.subscribe((data: INovaFilteringOutputs) => {
            this.state = { ...this.state, ...data };
            this.state = this.listService.updateSelectionState(this.state);

            if (data && data.paginator && data.paginator.reset) {
                this.paginator.page = 1;
            }

            const areItemsAvailable = data.paginator && !isUndefined(data.paginator.total) && data.paginator.total > 0;
            if (data && areItemsAvailable && data.repeat?.itemsSource.length === 0) {
                this.paginator.goToPage(this.paginator.page > 1 ? this.paginator.page - 1 : 1);
            }

            this.changeDetection.detectChanges();
        });

        this.dataSourceService.applyFilters();
    }

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }

    public applyFilters() {
        this.dataSourceService.applyFilters();
    }

    public onSelectorOutput(selectionType: SelectionType) {
        this.state = this.listService.applySelector(selectionType, this.state);
    }

    public onRepeatOutput(selectedItems: IExampleItem[]) {
        this.state = this.listService.selectItems(selectedItems, RepeatSelectionMode.multi, this.state);
    }
}

function getData() {
    return [
        { color: "regular-blue" },
        { color: "regular-green" },
        { color: "regular-yellow" },
        { color: "regular-cyan " },
        { color: "regular-magenta" },
        { color: "regular-black" },
        { color: "dark-blue" },
        { color: "dark-green" },
        { color: "dark-yellow" },
        { color: "dark-cyan " },
        { color: "dark-magenta" },
        { color: "dark-black" },
        { color: "light-blue" },
        { color: "light-green" },
        { color: "light-yellow" },
        { color: "light-cyan " },
        { color: "light-magenta" },
        { color: "light-black" },
    ];
}
