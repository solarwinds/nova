import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import {
    ClientSideDataSource,
    INovaFilteringOutputs, ListService, PaginatorComponent, RepeatComponent, RepeatSelectionMode, SearchComponent, SelectionType,
} from "@nova-ui/bits";
import { Subscription } from "rxjs";

interface IExampleItem {
    color: string;
}

@Component({
    selector: "nui-client-side-with-selection-example",
    providers: [ClientSideDataSource],
    templateUrl: "./client-side-with-selection.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSourceWithSelectionExampleComponent implements AfterViewInit, OnDestroy {
    public searchTerm = "";
    public page = 1;

    public state: INovaFilteringOutputs = {};

    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
    @ViewChild(SearchComponent) search: SearchComponent;
    @ViewChild(RepeatComponent) repeat: RepeatComponent;

    private outputsSubscription: Subscription;

    constructor(public dataSourceService: ClientSideDataSource<IExampleItem>,
        public changeDetection: ChangeDetectorRef,
        private listService: ListService) {
        dataSourceService.setData(getData());
    }

    async ngAfterViewInit() {
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

            this.changeDetection.detectChanges();
        });

        await this.applyFilters();
    }

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }

    public async applyFilters() {
        await this.dataSourceService.applyFilters();
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
