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

import { ArrayDataSource } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import {
    DataSourceService,
    expand,
    IMenuItem,
    INovaFilteringOutputs,
} from "@nova-ui/bits";

import { FilteredViewWithTreeDataSource } from "../filtered-view-with-tree-data-source.service";
import { IServer } from "../types";

@Component({
    selector: "app-filtered-view-tree",
    templateUrl: "./filtered-view-tree.component.html",
    styleUrls: ["./filtered-view-tree.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [expand],
    standalone: false,
})
export class FilteredViewTreeComponent implements OnDestroy, AfterViewInit {
    treeControl = new NestedTreeControl<any>((node) => node.children);
    dataSourceTree: ArrayDataSource<any>;

    public readonly sorterItems: IMenuItem[] = [
        {
            title: $localize`Name`,
            value: "name",
        },
        {
            title: $localize`Status`,
            value: "status",
        },
        {
            title: $localize`Location`,
            value: "location",
        },
    ];
    public items: IServer[] = [];
    public filteringState: INovaFilteringOutputs = {};

    private readonly destroy$ = new Subject<void>();

    constructor(
        @Inject(DataSourceService)
        private dataSource: FilteredViewWithTreeDataSource<IServer>,
        private cdRef: ChangeDetectorRef
    ) {}

    async ngAfterViewInit(): Promise<void> {
        this.dataSource.outputsSubject
            .pipe(
                tap((data: any) => {
                    // update the list of items to be rendered
                    this.dataSourceTree = new ArrayDataSource(
                        data.tree.itemsSource
                    );
                    this.cdRef.detectChanges();
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();

        await this.applyFilters();
    }

    hasChild = (_: number, node: any): boolean => !!node.children?.length;

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async applyFilters(): Promise<void> {
        await this.dataSource.applyFilters();
    }
}
