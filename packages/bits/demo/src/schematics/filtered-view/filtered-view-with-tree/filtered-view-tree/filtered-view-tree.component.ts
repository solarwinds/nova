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
import {
    DataSourceService, expand,
    IMenuItem,
    INovaFilteringOutputs,
} from "@solarwinds/nova-bits";
import {
    Subject,
} from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { FilteredViewWithTreeDataSource } from "../filtered-view-with-tree-data-source.service";
import {
    IServer,
} from "../types";

@Component({
    selector: "app-filtered-view-tree",
    templateUrl: "./filtered-view-tree.component.html",
    styleUrls: ["./filtered-view-tree.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [expand],
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

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService) private dataSource: FilteredViewWithTreeDataSource<IServer>,
        private cdRef: ChangeDetectorRef
    ) {
    }

    async ngAfterViewInit() {
        this.dataSource.outputsSubject.pipe(
            tap((data: any) => {
                // update the list of items to be rendered
                this.dataSourceTree = new ArrayDataSource(data.tree.itemsSource);
                this.cdRef.detectChanges();
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        await this.applyFilters();
    }

    hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async applyFilters() {
        await this.dataSource.applyFilters();
    }
}
