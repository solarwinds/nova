import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ViewChild,
    ViewRef
} from "@angular/core";
import {
    IFilteringOutputs,
    PaginatorComponent,
    SorterComponent,
    SorterDirection
} from "@solarwinds/nova-bits";

import { DataSourceFilterService } from "../services/data-source-filter.service";

@Component({
    selector: "rd-question-list",
    templateUrl: "./question-list.component.html",
    providers: [DataSourceFilterService],
})
export class QuestionListComponent implements AfterViewInit {
    public searchTerm = "";
    public page = 1;

    public state: IFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        paginator: {
            total: 0,
        },
    };

    public sorter = {
        items: ["date", "title"], // TODO: populate from data source
        sortDirection: SorterDirection.original,
    };

    @ViewChild("filteringPaginator", { static: true }) filteringPaginator: PaginatorComponent;
    @ViewChild("sorterRef", { static: true }) sorterRef: SorterComponent;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private dataSourceFilterService: DataSourceFilterService<IFilteringOutputs>) {
    }

    ngAfterViewInit() {
        this.dataSourceFilterService.componentTree = {
            paginator: {componentInstance: this.filteringPaginator},
            sorter: {componentInstance: this.sorterRef},
        };

        this.dataSourceFilterService.applyFilters();
        this.dataSourceFilterService.outputsSubject
            .subscribe((data: IFilteringOutputs) => {
                this.state = data;
                if (data && data.paginator && data.paginator.reset) {
                    this.filteringPaginator.goToPage(1);
                }
                if (!(this.changeDetectorRef as ViewRef).destroyed) {
                    this.changeDetectorRef.detectChanges();
                }
            });
    }

    public async onSearch() {
        this.dataSourceFilterService.applyFilters();
    }

    public changePagination() {
        this.dataSourceFilterService.applyFilters();
    }

    public onValueChange() {
        this.dataSourceFilterService.applyFilters();
    }

    public hasItems(): boolean {
        return !_isEmpty(_get(this, "state.repeat.itemsSource"));
    }
}
