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
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from "@angular/core";
import { Subscription } from "rxjs";

import {
    DataSourceService,
    IFilteringOutputs,
    ISelection,
    LocalFilteringDataSource,
    RepeatSelectionMode,
    SorterDirection,
} from "@nova-ui/bits";

import { IFilterGroupOption } from "../public-api";
// import { ListCompositeComponent } from "../list/list.component";

export interface IItemPickerOption {
    value: string;
    displayValue: string;
}

@Component({
    selector: "nui-item-picker-composite",
    templateUrl: "./item-picker.component.html",
    providers: [
        {
            provide: DataSourceService,
            useClass: LocalFilteringDataSource,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemPickerCompositeComponent
    implements AfterViewInit, OnInit, OnDestroy
{
    @Input() itemPickerOptions: IItemPickerOption[];
    @Input() selectedValues: string[] = [];

    @Output() selectionChanged: EventEmitter<ISelection> = new EventEmitter();

    public sorter = {
        items: ["value"],
        direction: SorterDirection.ascending,
    };

    public selectionMode = RepeatSelectionMode.multi;

    public filteringState: IFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        paginator: {
            total: undefined,
        },
    };

    public selection: ISelection = {
        isAllPages: false,
        include: [],
        exclude: [],
    };

    public page: number = 1;

    // @ViewChild("list", {static: false}) listComposite: ListCompositeComponent;

    private outputsSubscription: Subscription;

    constructor(
        @Inject(DataSourceService)
        public dataSource: DataSourceService<IFilterGroupOption>,
        public changeDetection: ChangeDetectorRef
    ) {}

    ngOnInit() {
        (
            this.dataSource as LocalFilteringDataSource<IFilterGroupOption>
        ).setData(this.itemPickerOptions);
        this.selection = {
            isAllPages: false,
            include: this.getSelectedOptions(),
            exclude: [],
        };
    }

    async ngAfterViewInit() {
        this.changeDetection.markForCheck();

        // this.dataSource.registerComponent(this.listComposite.getFilterComponents());

        this.outputsSubscription = this.dataSource.outputsSubject.subscribe(
            (data: IFilteringOutputs) => {
                this.filteringState = data;
            }
        );

        await this.dataSource.applyFilters();
    }

    public ngOnDestroy() {
        if (this.outputsSubscription) {
            this.outputsSubscription.unsubscribe();
        }
    }

    public applyFilters() {
        this.dataSource.applyFilters();
    }

    public onSelection(selection: ISelection) {
        this.selection = selection;
        this.selectionChanged.emit(this.selection);
    }

    public getSelectedOptions(): IFilterGroupOption[] {
        return this.itemPickerOptions.filter(
            (item) => this.selectedValues.indexOf(item.value) !== -1
        );
    }
}
