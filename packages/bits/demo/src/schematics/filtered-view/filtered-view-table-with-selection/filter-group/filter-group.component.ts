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
  input
} from "@angular/core";
import _orderBy from "lodash/orderBy";
import { Subject } from "rxjs";

import {
    CheckboxComponent,
    DialogService,
    IFilter,
    IFilterPub,
} from "@nova-ui/bits";

import {
    IFilterGroupItem,
    IFilterGroupMultiFilterMetadata,
    IFilterGroupOption,
} from "./public-api";

@Component({
    selector: "app-filter-group-with-selection",
    templateUrl: "./filter-group.component.html",
    styleUrls: ["./filter-group.component.less"],
    standalone: false,
})
export class FilterGroupComponent implements IFilterPub, OnInit, OnDestroy {
    // mark this filter to be monitored by our datasource for any changes in order reset other filters(eg: pagination)
    // before any new search is performed
    public detectFilterChanges = true;

    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() filterGroupItem: IFilterGroupItem;
    readonly checkboxTemplateRef = input<TemplateRef<string>>();
    readonly expanderTemplateRef = input<TemplateRef<string>>();

    @Output() filterChanged: EventEmitter<IFilterGroupItem> =
        new EventEmitter();
    @Output() showAllButtonClicked: EventEmitter<any> = new EventEmitter();

    @ViewChildren(CheckboxComponent) filterItems: QueryList<CheckboxComponent>;

    public onDestroy$ = new Subject<void>();

    constructor(@Inject(DialogService) private dialogService: DialogService) {}

    public ngOnInit(): void {
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

    public showFilterDialog(): void {
        this.showAllButtonClicked.emit();
    }

    public getDisplayedFiltersCount(): number {
        return this.filterGroupItem.itemsToDisplay
            ? this.filterGroupItem.itemsToDisplay
            : 10;
    }

    public hasFilterOptions(): boolean {
        return this.filterGroupItem.allFilterOptions.length > 0;
    }

    public deselectFilterItemByValue(value: any): void {
        const checkbox = this.filterItems.find((i) => i.value === value);
        if (checkbox) {
            this.deselectFilterItem(checkbox);
        }
    }

    public deselectAllFilterItems(): void {
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

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
