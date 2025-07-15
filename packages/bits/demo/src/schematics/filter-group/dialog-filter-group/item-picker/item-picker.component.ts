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
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnInit,
  output
} from "@angular/core";

import {
    DataSourceService,
    LocalFilteringDataSource,
    RepeatSelectionMode,
} from "@nova-ui/bits";

import { IFilterGroupOption } from "../public-api";

export interface IItemPickerOption {
    value: string;
    displayValue: string;
}

@Component({
    selector: "app-item-picker-composite",
    templateUrl: "./item-picker.component.html",
    styleUrls: ["./item-picker.component.less"],
    providers: [
        {
            provide: DataSourceService,
            useClass: LocalFilteringDataSource,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ItemPickerCompositeComponent implements OnInit {
    @Input() itemPickerOptions: IFilterGroupOption[];
    @Input() selectedValues: string[] = [];

    readonly selectionChanged = output<IFilterGroupOption[]>();

    public selectionMode = RepeatSelectionMode.multi;
    public selectedOptions: IFilterGroupOption[] = [];

    constructor(
        @Inject(DataSourceService)
        public dataSource: DataSourceService<IFilterGroupOption>
    ) {}

    public ngOnInit(): void {
        (
            this.dataSource as LocalFilteringDataSource<IFilterGroupOption>
        ).setData(this.itemPickerOptions);
        this.selectedOptions = this.getSelectedOptions();
    }

    public onSelection(selection: IFilterGroupOption[]): void {
        this.selectedOptions = selection;
        this.selectionChanged.emit(selection);
    }

    public getSelectedOptions(): IFilterGroupOption[] {
        return this.itemPickerOptions.filter(
            (item) => this.selectedValues.indexOf(item.value) !== -1
        );
    }
}
