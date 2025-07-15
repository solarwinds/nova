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
import {
    CdkNestedTreeNode,
    CdkTree,
    NestedTreeControl,
} from "@angular/cdk/tree";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injectable,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import { firstValueFrom, Observable, of, Subject } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { catchError, delay, map, take, takeUntil, tap } from "rxjs/operators";

import {
    DataSourceService,
    DialogService,
    DOCUMENT_CLICK_EVENT,
    EventBusService,
    expand,
    IDataSource,
    IFilter,
    IFilteringOutputs,
    INovaFilteringOutputs,
    INovaFilters,
    IRepeatItemConfig,
    LoggerService,
    nameof,
    NuiActiveDialog,
    NuiDialogRef,
    Paginator,
    Repeat,
    RepeatComponent,
    VirtualViewportManager,
} from "@nova-ui/bits";

interface IServerNode extends Partial<IServer> {
    name: string;
    hasChildren?: boolean;
    isLoading?: boolean;
    children?: IServerNode[];
}

export enum ServerStatus {
    active = "Active",
    down = "Down",
}

// implement custom filters
export interface IServerFilters extends INovaFilters {
    location?: IFilter<string>;
    name?: IFilter<string>;
    status?: IFilter<ServerStatus>;
}

// collection of items that we've transformed from the backend API
export interface IServersCollection {
    items: IServer[];
    count: number;
    status?: IFilter<Record<string, number>>;
    location?: IFilter<Record<string, number>>;
}

// main server model being received from the backend
export interface IServer {
    location: string;
    name: string;
    status: ServerStatus;
}
// collection of items that we've received from the backend API response
export interface IServersApiResponse {
    count: number;
    items: IServer[];
}

const TREE_DATA: IServerNode[] = [
    {
        name: "Nodes",
        hasChildren: true,
        children: [
            {
                name: "Brno",
                hasChildren: true,
                children: [],
            },
            {
                name: "Austin",
                hasChildren: true,
                children: [],
            },
            {
                name: "Kyiv",
                hasChildren: true,
                children: [],
            },
        ],
    },
];

const RESULTS_PER_PAGE = 25;

export const API_URL = "https://nova-pg.swdev.local/api/v1/servers";

/**
 * Example of a ServerSide DataSourceService which is using the Nova Backend API
 * to fetch data
 */
@Injectable()
export class VirtualScrollListDataSource<T = any>
    extends DataSourceService<T>
    implements IDataSource
{
    // cache used to store our previous fetched results while scrolling
    // and more data is automatically fetched from the backend
    private cache = Array.from<IServer>({ length: 0 });
    private previousFilters: INovaFilters;

    constructor(private logger: LoggerService, private http: HttpClient) {
        super();
    }

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<INovaFilteringOutputs> {
        // Every new search request or filter change should
        // clear the cache in order to correctly display a new set of data
        const reset = this.filtersChanged(
            filters,
            nameof<IServerFilters>("status"),
            nameof<IServerFilters>("location"),
            nameof<IServerFilters>("search"),
            nameof<IServerFilters>("sorter")
        );

        if (reset || filters.virtualScroll?.value.start === 0) {
            this.cache = [];
        }
        return firstValueFrom(
            this.getBackendData(filters).pipe(
                // eslint-disable-next-line import/no-deprecated
                tap((response: IServersCollection) => {
                    // after receiving data we need to append it to our previous fetched results
                    this.cache = this.cache.concat(response.items);
                }),
                // eslint-disable-next-line import/no-deprecated
                map((response: IServersCollection) => {
                    const itemsSource = this.cache;

                    return {
                        repeat: { itemsSource: itemsSource },
                        paginator: {
                            total: response.count,
                        },
                    };
                })
            )
        );
    }

    public reset(): void {
        this.cache = [];
    }

    // build query params specific to our backend API
    private getRequestParams(filters: INovaFilters): HttpParams {
        const paging = filters.virtualScroll?.value ?? { start: 0, end: 0 };
        const params = new HttpParams()
            // define the start page used by the virtual scroll internal "paginator"
            .set("page", Math.ceil(paging.start / RESULTS_PER_PAGE).toString())
            // specify the maximum number of items we need to fetch for each request
            .set("pageSize", String(RESULTS_PER_PAGE))
            .set("searchField", "location")
            .set("searchContent", filters.search?.value ?? "");

        return params;
    }

    private getBackendData(
        filters: INovaFilters
    ): Observable<IServersCollection> {
        // fetch response from the backend
        const requestParams = this.getRequestParams(filters);
        return this.http
            .get<IServersApiResponse>(API_URL, { params: requestParams })
            .pipe(
                delay(300),
                // eslint-disable-next-line import/no-deprecated
                map((response) => ({
                    items:
                        response.items?.map((item) => ({
                            name: item.name,
                            location: item.location,
                            status: item.status,
                        })) || [],
                    count: response.count,
                })),
                catchError((e) => {
                    this.logger.error(e);
                    return of({
                        items: [],
                        count: 0,
                    });
                })
            );
    }

    // checks if any of the filters specified by name have changed from the previous evaluation
    public filtersChanged(
        filters: INovaFilters,
        ...filterNames: string[]
    ): boolean {
        for (let i = 0; i < filterNames.length; i++) {
            const filterName = filterNames[i];
            const filter = filters[filterName];
            if (
                !isNil(filter?.value) &&
                this.previousFilters &&
                !isEqual(filter?.value, this.previousFilters[filterName]?.value)
            ) {
                return true;
            }
        }

        return false;
    }
}

@Component({
    selector: "nui-tree-show-all-dialog-example",
    templateUrl: "./tree-show-all-dialog.example.component.html",
    styleUrls: ["./tree-show-all-dialog.component.example.less"],
    animations: [expand],
    providers: [VirtualScrollListDataSource],
    standalone: false,
})
export class TreeShowAllDialogExampleComponent implements OnDestroy {
    private activeDialogRef: NuiDialogRef;
    private get activeDialogComponent(): TreeDialogContentExampleComponent {
        return this.activeDialogRef.componentInstance;
    }
    private destroy$ = new Subject<void>();
    @ViewChild(CdkTree) private cdkTree: CdkTree<IServerNode>;

    public nodesTotalItems: { [key: string]: number } = {};

    public treeControl = new NestedTreeControl<IServerNode>(
        (node) => node.children
    );
    public dataSource = new ArrayDataSource(TREE_DATA);

    public hasChild = (_: number, node: IServerNode): boolean =>
        !!node.children;

    constructor(
        private virtualScrollListDataSource: VirtualScrollListDataSource,
        private differ: IterableDiffers,
        private eventBusService: EventBusService,
        private dialogService: DialogService
    ) {}

    public showAll(node: IServerNode): void {
        // setup the Dialog
        this.activeDialogRef = this.dialogService.open(
            TreeDialogContentExampleComponent,
            { size: "sm" }
        );
        // pass the inputs to the context component
        this.activeDialogComponent.items = [];
        this.activeDialogComponent.isLoading = true;
        this.activeDialogComponent.cdRef.detectChanges();

        // Set location search criteria
        this.setDsSearchFieldFor(node);
        this.subscribeToDialogScrolling();

        this.activeDialogRef.closed$.subscribe(() => {
            this.virtualScrollListDataSource.deregisterComponent(
                "virtualScroll"
            );
            this.virtualScrollListDataSource.deregisterComponent("search");
            this.virtualScrollListDataSource.reset();
        });
    }

    /**
     * Register the viewport container to the DataSource
     */
    private subscribeToDialogScrolling() {
        // 'setTimeout' to wait until the dialog is rendered
        setTimeout(() => {
            const viewPortManager = this.activeDialogComponent.viewPortManager;

            this.virtualScrollListDataSource.registerComponent({
                virtualScroll: { componentInstance: viewPortManager },
            });

            viewPortManager
                .observeNextPage$({ pageSize: RESULTS_PER_PAGE })
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.virtualScrollListDataSource.applyFilters();
                    this.virtualScrollListDataSource.outputsSubject.subscribe(
                        (v) => {
                            if (!this.activeDialogComponent) {
                                return;
                            } // in case dialog was closed early
                            const items = v.repeat.itemsSource as IServer[];
                            this.activeDialogComponent.items = items;
                            this.activeDialogComponent.isLoading = false;
                            this.activeDialogComponent.cdRef.detectChanges();
                        }
                    );
                });
        });
    }

    /** Load first page on first open */
    public onToggleClick(
        node: IServerNode,
        nestedNode: CdkNestedTreeNode<any>
    ): void {
        this.eventBusService
            .getStream(DOCUMENT_CLICK_EVENT)
            .next(new MouseEvent("click"));

        if (node.hasChildren && node.children && !node.children.length) {
            node.isLoading = true;
            this.setDsSearchFieldFor(node);
            this.virtualScrollListDataSource.applyFilters();
            this.virtualScrollListDataSource.outputsSubject
                .pipe(take(1))
                .subscribe((v: IFilteringOutputs) => {
                    const repeat = v.repeat as Repeat;
                    const paginator = v.paginator as Paginator;

                    const items: IServer[] = repeat.itemsSource;
                    const total: number = paginator.total;

                    this.handleNodeTotalItems(node.name, total);
                    this.handleNodeContent(node, nestedNode, items);
                    node.isLoading = false;
                    this.virtualScrollListDataSource.deregisterComponent(
                        "search"
                    );
                });
        }
    }

    private handleNodeTotalItems(nodeId: string, totalItems: number) {
        this.nodesTotalItems[nodeId] = totalItems;
    }

    private handleNodeContent(
        node: IServerNode,
        nestedNodeDirective: CdkNestedTreeNode<any>,
        items: IServerNode[]
    ) {
        node.children = [];
        const differ: IterableDiffer<IServerNode> = this.differ
            .find(node.children)
            .create();
        node.children = items;

        // clear previously rendered leaf nodes
        nestedNodeDirective.nodeOutlet.first.viewContainer.clear();
        this.cdkTree.renderNodeChanges(
            node.children,
            differ,
            nestedNodeDirective.nodeOutlet.first.viewContainer,
            node
        );
    }

    /** Register node name as a search to get nodes of one location */
    private setDsSearchFieldFor(node: IServerNode) {
        this.virtualScrollListDataSource.registerComponent({
            search: {
                componentInstance: {
                    getFilters: () => ({
                        type: "search",
                        value: node.name,
                    }),
                },
            },
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

@Component({
    selector: "nui-dialog-content-dialog-example",
    template: `
        <nui-dialog-header
            title="Dialog title"
            i18n-title
            (closed)="close()"
        ></nui-dialog-header>

        <div nui-busy [busy]="isLoading">
            <div class="d-flex flex-row">
                <nui-repeat
                    class="virtual-scroll-list-repeat"
                    [itemConfig]="itemConfig"
                    [repeatItemTemplateRef]="repeatItemTemplate"
                    [itemsSource]="items"
                    [virtualScroll]="true"
                    [itemSize]="30"
                ></nui-repeat>
            </div>
        </div>

        <nui-dialog-footer>
            <button nui-button type="button" (click)="close()" i18n>
                Close
            </button>
        </nui-dialog-footer>

        <ng-template #repeatItemTemplate let-item="item">
            <div class="d-flex justify-content-between w-100">
                <span>Node: {{ item.name }}</span>
                <span> Status: {{ item.status }}</span>
            </div>
        </ng-template>
    `,
    animations: [],
    providers: [VirtualViewportManager],
    styles: [
        `
            .virtual-scroll-list-repeat {
                /* height has to be defined if using 'nui-repeat' with virtual scroll */
                height: 400px;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class TreeDialogContentExampleComponent implements AfterViewInit {
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() items: IServerNode[] = [];
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() isLoading: boolean = false;

    public itemConfig: IRepeatItemConfig = {
        trackBy: (index: number, item: IServerNode): string | undefined =>
            item?.name,
    };

    @ViewChild(RepeatComponent)
    public repeat: RepeatComponent;

    constructor(
        public cdRef: ChangeDetectorRef,
        public viewPortManager: VirtualViewportManager,
        @Inject(NuiActiveDialog) public activeDialog: any
    ) {}

    public ngAfterViewInit(): void {
        this.viewPortManager.setViewport(this.repeat.viewportRef);
    }

    close(): void {
        this.activeDialog.close();
    }
}
