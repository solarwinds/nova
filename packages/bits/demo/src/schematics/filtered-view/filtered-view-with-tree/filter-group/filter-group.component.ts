import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChildren,
} from "@angular/core";
import {
    CheckboxComponent,
    DialogService,
    IFilter,
    IFilterPub,
} from "@nova-ui/bits";
import _orderBy from "lodash/orderBy";
import { Subject } from "rxjs";

import {
    IFilterGroupItem,
    IFilterGroupMultiFilterMetadata,
    IFilterGroupOption,
} from "./public-api";

@Component({
    selector: "app-filter-group",
    templateUrl: "./filter-group.component.html",
    styleUrls: ["./filter-group.component.less"],
})
export class FilterGroupComponent implements IFilterPub, OnInit, OnDestroy {
    @Input() filterGroupItem: IFilterGroupItem;
    @Input() checkboxTemplateRef: TemplateRef<string>;
    @Input() expanderTemplateRef: TemplateRef<string>;

    @Output() filterChanged: EventEmitter<IFilterGroupItem> =
        new EventEmitter();
    @Output() showAllButtonClicked: EventEmitter<any> = new EventEmitter();

    @ViewChildren(CheckboxComponent) filterItems: QueryList<CheckboxComponent>;

    public onDestroy$ = new Subject<void>();

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

    public deselectFilterItemByValue(value: any) {
        const checkbox = this.filterItems.find((i) => i.value === value);
        if (checkbox) {
            this.deselectFilterItem(checkbox);
        }
    }

    public deselectAllFilterItems() {
        this.filterItems
            .filter((i) => i.checked)
            .forEach((i) => this.deselectFilterItem(i));
    }

    private deselectFilterItem(checkbox: CheckboxComponent) {
        checkbox.inputViewContainer.element.nativeElement.checked = false;
        checkbox.inputViewContainer.element.nativeElement.dispatchEvent(
            new Event("change")
        );
    }

    private getAllFilterOptionsList(
        filterGroupItems: IFilterGroupOption[]
    ): string[] {
        return filterGroupItems.map((item) => item.value);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
