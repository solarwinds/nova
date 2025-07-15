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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  output
} from "@angular/core";

import {
    ClientSideDataSource,
    DataSourceService,
    ISelection,
    RepeatSelectionMode,
    SorterDirection,
} from "@nova-ui/bits";

import { IFilterGroupOption } from "../public-api";

export interface IItemPickerOption {
    value: string;
    displayValue: string;
}

@Component({
    selector: "app-item-picker-table-selection",
    templateUrl: "./item-picker.component.html",
    providers: [
        {
            provide: DataSourceService,
            useClass: ClientSideDataSource,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ItemPickerComponent implements OnInit, AfterViewInit {
    @Input() itemPickerOptions: IItemPickerOption[];
    @Input() selectedValues: string[] = [];

    readonly selectionChanged = output<ISelection>();

    public sorter = {
        items: ["value"],
        direction: SorterDirection.ascending,
    };

    public selectionMode = RepeatSelectionMode.multi;

    public selection: ISelection = {
        isAllPages: false,
        include: [],
        exclude: [],
    };

    constructor(
        @Inject(DataSourceService)
        public dataSource: DataSourceService<IFilterGroupOption>,
        public changeDetection: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        (this.dataSource as ClientSideDataSource<IFilterGroupOption>).setData(
            this.itemPickerOptions
        );
        this.selection = {
            isAllPages: false,
            include: this.getSelectedOptions(),
            exclude: [],
        };
    }

    public ngAfterViewInit(): void {
        this.changeDetection.markForCheck();

        this.dataSource.applyFilters();
    }

    public applyFilters(): void {
        this.dataSource.applyFilters();
    }

    public onSelection(selection: ISelection): void {
        this.selection = selection;
        this.selectionChanged.emit(this.selection);
    }

    public getSelectedOptions(): IFilterGroupOption[] {
        return this.itemPickerOptions.filter(
            (item) => this.selectedValues.indexOf(item.value) !== -1
        );
    }
}
