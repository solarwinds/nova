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

import { Component, Inject, Input, Optional } from "@angular/core";

import { RepeatComponent } from "@nova-ui/bits";

export enum SchematicsDocsComponentType {
    "list" = "list",
    "table" = "table",
}

@Component({
    selector: "nui-schematic-cli-option",
    templateUrl: "./schematic-docs-cli-option.component.html",
})
export class SchematicsDocsCliOptionComponent {
    @Input() name: string;

    public componentType = SchematicsDocsComponentType;

    public fetch = `fetchURI = "\${this.url\}/?page=\${end / (end - start)}&results=\${end - start}"`;

    public dataSourceSetup = {
        extendDS: `@Injectable()
export class RandomuserTableDataSource extends DataSourceService<ITableModel> {
    constructor(private searchService: SearchService) {
        super();
    }
}`,
        defineFields: `private readonly url = "https://yourserver.com/api";
private cache = Array.from<ITableModel>({ length: 0 });
public busy = new BehaviorSubject(false);`,
        getData: `public async getData(start: number = 0, end: number= 20): Promise<INovaFilteringOutputs> {
    let response: IRandomuserResponse = null;
    try {
        response = await
                    (await fetch("this.fetchURI"))
                        .json();
                            return {
                                users: response.results.map((result: IRandomuserResults, i: number) => ({
                                    no: this.cache.length + i + 1,
                                    nameTitle: result.name.title,
                                    nameFirst: result.name.first,
                                    nameLast: result.name.last,
                                    gender: result.gender,
                                    country: result.location.country,
                                    city: result.location.city,
                                    postcode: result.location.postcode,
                                    email: result.email,
                                    cell: result.cell,
                                })),
                                total: response.results.length,
                                start: start,
                            } as UsersQueryResponse;
    } catch (e) {
        console.error("Error responding from server. Please visit https://https://randomuser.me/ to see if it's available");
    }
}`,
        getFilteredData: `public async getFilteredData(filters: INovaFilters): Promise<INovaFilteringOutputs> {
    this.busy.next(true);
    const virtualScrollFilter = filters.virtualScroll && filters.virtualScroll.value;
    const start = virtualScrollFilter ? filters.virtualScroll.value.start : 0;
    const end = virtualScrollFilter ? filters.virtualScroll.value.end : 0;

    this.getData(start, end).then((response: UsersQueryResponse) => {
        if (!response) { return; }

        this.cache = this.cache.concat(response.users);
        this.dataSubject.next(this.cache);
        this.busy.next(false);
    });

    return {
        repeat: {
            itemsSource: this.cache,
        },
        totalItems: 200,
    }
}`,
    };

    public tableScrollingSetup = {
        vars: `
// will store the table data received from the server
public totalItems: number = 0;
public isBusy: boolean = false;

// number of items to be fetched for each request
public pageSize: number = 40;

private onDestroy$: Subject<void> = new Subject<void>();

// stores the cached table data dynamically changed after every request from the server
// this value is set to the dataSource input of the nui-table.
public items: IServer[] = [];

// define the array of columns for the table
// the table data from the datasource to the users var must come in the very same format.
public displayedColumns = ["name", "location", "status"];

// datasource that you inject, or instantiate in constructor
private dataSource: TableWithVirtualScrollDataSource;
`,
        viewportManagerImport: `import { VirtualViewportManager } from "@nova-ui/bits";`,
        viewChildren: `
@ViewChild(CdkVirtualScrollViewport, { static: false }) viewport: CdkVirtualScrollViewport;
`,
        provideViewport: `
@Component({
    //
    providers: [VirtualViewportManager]
})
`,
        injectViewport: `
constructor(private viewportManager: VirtualViewportManager) {}
`,
        oninitSubscribeBusy: `
ngOnInit(): void {
    this.dataSource.busy.subscribe(busy => {
        this._isBusy = busy;
    });
}`,
        registerScroll: `private registerVirtualScroll() {
    this.dataSource.registerComponent({
        virtualScroll: { componentInstance: this.viewportManager },
    });
 }`,
        ngAfterViewInitStart: `ngAfterViewInit(): void {
    this.registerVirtualScroll();
}`,
        ngAfterViewInitViewport: `this.viewportManager
    // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
    .setViewport(this.viewport)
    // Note: Initializing the stream with the desired page size, based on which
    // VirtualViewportManager will perform the observations and will emit
    // distinct ranges with step equal to provided pageSize
    .observeNextPage$({pageSize: this.range}).pipe(
    // Note: In case we know the total number of items we can stop the stream when dataset end is reached
    // Otherwise we can let VirtualViewportManager to stop when last received page range will not match requested range
    filter(range => this.totalItems ? this.totalItems >= range.end : true),
    tap(() => this.dataSource.applyFilters()),
    // Note: Using the same stream to subscribe to the outputsSubject and update the items list
    switchMap(() => this.dataSource.outputsSubject.pipe(
        tap((outputs: IFilteringOutputs) => {
            this._totalItems = outputs.totalItems;
            this.users = outputs.repeat.itemsSource || [];
            this.cd.detectChanges();
        })
    )),
    takeUntil(this.onDestroy$)
).subscribe();
        `,
    };

    public constructor(
        @Optional()
        @Inject(SchematicsDocsComponentType)
        public forComponent?: SchematicsDocsComponentType
    ) {}

    public getRepeatPropKey(key: keyof RepeatComponent): string {
        return key;
    }

    public for(forComponent: SchematicsDocsComponentType) {
        return this.forComponent === forComponent || !this.forComponent;
    }
}
