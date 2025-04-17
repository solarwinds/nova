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
    OnDestroy,
    ViewChild,
} from "@angular/core";
import isUndefined from "lodash/isUndefined";
import { Subscription } from "rxjs";

import {
    INovaFilteringOutputs,
    ListService,
    LocalFilteringDataSource,
    PaginatorComponent,
    RepeatComponent,
    RepeatSelectionMode,
    SearchComponent,
    SelectionType,
} from "@nova-ui/bits";

interface IExampleItem {
    color: string;
}

/**
 * TODO: Remove in  - NUI-5835
 * @deprecated
 */
@Component({
    selector: "nui-deprecated-client-side-with-selection-example",
    providers: [LocalFilteringDataSource],
    templateUrl: "./client-side-with-selection.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DepreacatedDataSourceWithSelectionExampleComponent
    implements AfterViewInit, OnDestroy
{
    public searchTerm = "";
    public page = 1;

    public state: INovaFilteringOutputs = {};

    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
    @ViewChild(SearchComponent) search: SearchComponent;
    @ViewChild(RepeatComponent) repeat: RepeatComponent;

    private outputsSubscription: Subscription;

    constructor(
        public dataSourceService: LocalFilteringDataSource<IExampleItem>,
        public changeDetection: ChangeDetectorRef,
        private listService: ListService
    ) {
        dataSourceService.setData(getData());
    }

    public ngAfterViewInit(): void {
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

        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.state = { ...this.state, ...data };
                    this.state = this.listService.updateSelectionState(
                        this.state
                    );

                    if (data && data.paginator && data.paginator.reset) {
                        this.paginator.page = 1;
                    }

                    const areItemsAvailable =
                        data.paginator &&
                        !isUndefined(data.paginator.total) &&
                        data.paginator.total > 0;
                    if (
                        data &&
                        areItemsAvailable &&
                        data.repeat?.itemsSource.length === 0
                    ) {
                        this.paginator.goToPage(
                            this.paginator.page > 1
                                ? this.paginator.page - 1
                                : 1
                        );
                    }

                    this.changeDetection.detectChanges();
                }
            );

        this.dataSourceService.applyFilters();
    }

    public ngOnDestroy(): void {
        this.outputsSubscription.unsubscribe();
    }

    public applyFilters(): void {
        this.dataSourceService.applyFilters();
    }

    public onSelectorOutput(selectionType: SelectionType): void {
        this.state = this.listService.applySelector(selectionType, this.state);
    }

    public onRepeatOutput(selectedItems: IExampleItem[]): void {
        this.state = this.listService.selectItems(
            selectedItems,
            RepeatSelectionMode.multi,
            this.state
        );
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
