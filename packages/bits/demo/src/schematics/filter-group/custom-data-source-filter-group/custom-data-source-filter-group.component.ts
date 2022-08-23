import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
    TemplateRef,
} from "@angular/core";
import _orderBy from "lodash/orderBy";

import { DialogService, IFilter, IFilterPub } from "@nova-ui/bits";

import {
    IFilterGroupItem,
    IFilterGroupMultiFilterMetadata,
    IFilterGroupOption,
} from "./public-api";

@Component({
    selector: "app-custom-data-source-filter-group",
    templateUrl: "./custom-data-source-filter-group.component.html",
    styleUrls: ["./custom-data-source-filter-group.component.less"],
})
export class CustomDataSourceFilterGroupCompositeComponent
    implements IFilterPub, OnInit
{
    @Input() filterGroupItem: IFilterGroupItem;
    @Input() checkboxTemplateRef: TemplateRef<string>;
    @Input() expanderTemplateRef: TemplateRef<string>;

    @Output() filterChanged: EventEmitter<IFilterGroupItem> =
        new EventEmitter();
    @Output() showAllButtonClicked: EventEmitter<any> = new EventEmitter();

    constructor(@Inject(DialogService) private dialogService: DialogService) {}

    ngOnInit() {
        this.filterGroupItem.allFilterOptions = _orderBy(
            this.filterGroupItem.allFilterOptions,
            "value",
            "asc"
        );
    }

    public isChecked(value: string): boolean {
        return this.filterGroupItem.selectedFilterValues.indexOf(value) > -1;
    }

    public onValueChanged(selectedValues: string[]): void {
        this.filterGroupItem.selectedFilterValues = selectedValues;
        this.filterChanged.emit(this.filterGroupItem);
    }

    public onOpenChanged(isExpanded: boolean): void {
        this.filterGroupItem.expanded = isExpanded;
    }

    public getFilters(): IFilter<string[], IFilterGroupMultiFilterMetadata> {
        return {
            type: "string[]",
            value: this.filterGroupItem.selectedFilterValues,
            metadata: {
                allCategories: this.getAllFilterOptionsList(
                    this.filterGroupItem.allFilterOptions
                ),
                expanded: Boolean(this.filterGroupItem.expanded),
            },
        };
    }

    public showFilterDialog() {
        this.showAllButtonClicked.emit();
    }

    public getDisplayedFiltersCount() {
        return this.filterGroupItem.itemsToDisplay
            ? this.filterGroupItem.itemsToDisplay
            : 10;
    }

    public hasFilterOptions(): boolean {
        return this.filterGroupItem.allFilterOptions.length > 0;
    }

    private getAllFilterOptionsList(
        filterGroupItems: IFilterGroupOption[]
    ): string[] {
        return filterGroupItems.map((item) => item.value);
    }
}
