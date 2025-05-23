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
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { BehaviorSubject } from "rxjs";

import {
    IFilteringOutputs,
    SearchService,
    SelectorService,
} from "@nova-ui/bits";

import { IRandomUserTableModel } from "../index";
import { RandomuserTableDataSource1 } from "../table-virtual-scroll-datasource-1";

@Component({
    selector: "nui-table-virtual-scroll-steps-and-button-example",
    templateUrl: "./table-virtual-scroll-steps-and-button.example.component.html",
    styleUrls: [
        "./table-virtual-scroll-steps-and-button.example.component.less",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class TableVirtualScrollStepsAndButtonExampleComponent
    implements OnDestroy, OnInit
{
    // This value is obtained from the server and used to evaluate the total number of pages to display
    private _loadedItems: number = 0;
    private _isBusy: boolean = false;

    get loadedItems(): number {
        return this._loadedItems;
    }
    get isBusy(): boolean {
        return this._isBusy;
    }

    // The dynamically changed array of items to render by the table
    public users = new BehaviorSubject<IRandomUserTableModel[]>([]);

    public displayedColumns: string[] = [
        "no",
        "nameTitle",
        "nameFirst",
        "nameLast",
        "gender",
        "country",
        "city",
        "postcode",
        "email",
        "cell",
    ];

    public gridHeight = 400;
    public makeSticky: boolean = true;
    public step: number = 100;
    public itemsToLoad: number = 500;
    public totalItems: number = 0;

    private dataSource: RandomuserTableDataSource1;

    constructor(
        public selectorService: SelectorService,
        private cd: ChangeDetectorRef,
        private searchService: SearchService
    ) {
        this.dataSource = new RandomuserTableDataSource1(searchService);
        this.dataSource.step.next(this.step);
        this.dataSource.itemsToLoad.next(this.itemsToLoad);
    }

    public ngOnInit(): void {
        this.dataSource.outputsSubject.subscribe(
            (outputs: IFilteringOutputs) => {
                if (!outputs) {
                    return;
                }

                this.users.next(outputs.repeat.itemsSource);
                this._loadedItems = outputs.itemsToLoad;
                this.totalItems = outputs.totalItems;
                this.dataSource.step.next(this.step);

                /**
                 * Option 1:
                 * When Option 2 code snippet (see below) is commented out, and the following one is uncommented,
                 * lets the table to load all available items in API step by step without user interaction.
                 */

                // if (this.users.value.length < this.totalItems) {
                //     this.loadAll();
                // }

                /**
                 * Option 2:
                 * When Option 1 code snippet (see above) is commented out, and the following one is uncommented,
                 * lets the table ot load only the amount of items set in the ${itemsToLoad} variable. Requires user action to fetch another chunk of data.
                 */
                if (this.users.value.length < this.loadedItems) {
                    const leftover =
                        this.users.value.length -
                        this.itemsToLoad *
                            Math.round(
                                this.users.value.length / this.itemsToLoad
                            );
                    if (this.step > Math.abs(leftover)) {
                        this.dataSource.step.next(this.itemsToLoad % this.step);
                    }
                    this.dataSource.applyFilters();
                }

                this.cd.detectChanges();
            }
        );
        this.dataSource.applyFilters();

        this.dataSource.busy.subscribe((busy) => {
            this._isBusy = busy;
        });
    }

    public ngOnDestroy(): void {
        this.dataSource.busy.unsubscribe();
        this.dataSource.outputsSubject.unsubscribe();
        this.users.complete();
    }

    public loadAll(): void {
        const delta = this.totalItems - this.users.value.length;

        if (this.step > delta) {
            this.dataSource.step.next(delta);
        }
        this.dataSource.applyFilters();
    }

    public loadMore(): void {
        const toLoad = Math.min(
            this.totalItems - this.loadedItems,
            this.itemsToLoad
        );
        if (toLoad < this.itemsToLoad) {
            this.dataSource.step.next(toLoad);
        }
        this.dataSource.itemsToLoad.next(this.loadedItems + toLoad);
        this.dataSource.applyFilters();
    }

    public isAllLoaded(): boolean {
        return (
            this.users.value.length === this.totalItems &&
            this.users.value.length !== 0
        );
    }

    public isChunkLoaded(): boolean {
        return (
            this.users.value.length === this.loadedItems &&
            this.users.value.length !== 0
        );
    }
}
