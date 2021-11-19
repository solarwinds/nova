import { AfterViewInit, Component, Inject, OnDestroy, QueryList, ViewChildren } from "@angular/core";
import { DataSourceService, IFilteringParticipants, INovaFilteringOutputs } from "@nova-ui/bits";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { Subscription } from "rxjs";

import { CustomDataSourceFilterGroupCompositeComponent } from "./custom-data-source-filter-group.component";
import { FilterGroupCustomDataSourceService } from "./custom-data-source.service";
import { ICustomDSFilteredData, IFilterGroupItem } from "./public-api";

@Component({
    selector: "app-custom-data-source-filter-group-composite-example",
    templateUrl: "custom-data-source-filter-group.example.component.html",
    providers: [{
        provide: DataSourceService,
        useClass: FilterGroupCustomDataSourceService,
    }],
})
export class CustomDataSourceFilterGroupExampleComponent implements AfterViewInit, OnDestroy {
    @ViewChildren(CustomDataSourceFilterGroupCompositeComponent) filterGroups: QueryList<CustomDataSourceFilterGroupCompositeComponent>;

    public filterGroupItems?: Array<IFilterGroupItem> = [];
    public filteringState?: INovaFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        color: [],
        status: [],
    };
    private filterGroupSubscriptions: Array<Subscription> = [];

    constructor(@Inject(DataSourceService) private filterGroupCustomDataSourceService: FilterGroupCustomDataSourceService) { }

    ngAfterViewInit(): void {

        this.filterGroupSubscriptions.push(
            this.filterGroupCustomDataSourceService.outputsSubject.subscribe((filteredData: ICustomDSFilteredData) => {
                this.filterGroupItems = filteredData.filterGroupItems;
                this.filteringState = filteredData.filteringState;
            })
        );

        this.filterGroupSubscriptions.push(
            this.filterGroups.changes.subscribe(() => {
                this.filterGroupCustomDataSourceService.registerComponent(this.getFilterComponents());
            })
        );
        this.filterGroupCustomDataSourceService.applyFilters();
    }

    public changeFilters(event: IFilterGroupItem): void {
        this.filterGroupCustomDataSourceService.applyFilters();
    }

    public hasItems(): boolean {
        return !_isEmpty(_get(this, "filteringState.repeat.itemsSource"));
    }

    private getFilterComponents(): IFilteringParticipants {
        return this.filterGroups.reduce((obj: IFilteringParticipants, item: CustomDataSourceFilterGroupCompositeComponent) => {
            obj[item.filterGroupItem.id] = { componentInstance: item };
            return obj;
        }, {});
    }

    ngOnDestroy(): void {
        this.filterGroupSubscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
