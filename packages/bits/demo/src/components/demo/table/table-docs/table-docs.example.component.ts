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

import { Component, forwardRef } from "@angular/core";
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { TableBasicExampleComponent } from "../table-basic/table-basic.example.component";
import { TablePinnedHeaderComponent } from "../table-pinned-header/table-pinned-header.example.component";
import { TableCellContentAlignComponent } from "../table-cell-content-align/table-cell-content-align.example.component";
import { TableCellWidthSetExampleComponent } from "../table-cell-width-set/table-cell-width-set.example.component";
import { TableRowHeightSetExampleComponent } from "../table-row-height-set/table-row-height-set.example.component";
import { TableReorderExampleComponent } from "../table-reorder/table-reorder.example.component";
import { TableColumnsAddRemoveExampleComponent } from "../table-columns-add-remove/table-columns-add-remove.example.component";
import { TableResizeExampleComponent } from "../table-resize/table-resize.example.component";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { TableSelectExampleComponent } from "../table-select/table-select.example.component";
import { TableRowClickableExampleComponent } from "../table-row-clickable/table-row-clickable.example.component";
import { TableVirtualScrollStepsAndButtonExampleComponent } from "../table-virtual-scroll-steps-and-button/table-virtual-scroll-steps-and-button.example.component";
import { TableVirtualScrollStickyHeaderExampleComponent } from "../table-virtual-scroll-sticky-header/table-virtual-scroll-sticky-header-example.component";
import { TableVirtualScrollSelectStickyHeaderExampleComponent } from "../table-virtual-scroll-select-sticky-header/table-virtual-scroll-select-sticky-header-example.component";

@Component({
    selector: "nui-table-docs-example",
    templateUrl: "./table-docs.example.component.html",
    imports: [NuiDocsModule, TableBasicExampleComponent, TablePinnedHeaderComponent, TableCellContentAlignComponent, TableCellWidthSetExampleComponent, TableRowHeightSetExampleComponent, TableReorderExampleComponent, TableColumnsAddRemoveExampleComponent, TableResizeExampleComponent, forwardRef(() => TableRowSelectInstructionsComponent), NuiMessageModule, TableSelectExampleComponent, TableRowClickableExampleComponent, TableVirtualScrollStepsAndButtonExampleComponent, TableVirtualScrollStickyHeaderExampleComponent, TableVirtualScrollSelectStickyHeaderExampleComponent]
})
export class TableDocsComponent {
    public alignmentCode = `<td nui-cell *nuiCellDef="let element">
     <div class="custom-class">
         {{element.status}}
     </div>
 </td>`;
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
private _totalItems: number = 0;
private _isBusy: boolean = false;

private range: number = 40;
private onDestroy$: Subject<void> = new Subject<void>();

get totalItems() { return this._totalItems; }
get isBusy() { return this._isBusy; }

public users: IRandomuserTableModel[] = [];
public displayedColumns: string[] = ["no", "nameTitle", "nameFirst", "nameLast", "gender", "country", "city", "postcode", "email", "cell"];
private dataSource: RandomuserTableDataSource;
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
public ngOnInit(): void {
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
}

@Component({
    selector: "nui-table-row-selection-instructions",
    template: `
        <ol>
            <li>
                Specify <code>selectionConfig</code> input, with
                <code>enabled = true</code> and
                <code>selectionMode !== TableSelectionMode.None</code>.
                <br />
                <strong>Deprecated: </strong>Specify
                <code>selectable = true</code> input. This approach will behave
                as if <code>selectionMode</code> was set to
                <code>TableSelectionMode.Multi</code>.
            </li>
            <li>
                Bind a trackBy handler to the
                <code
                    ><a
                        href="https://material.angular.io/cdk/table/overview#connecting-the-table-to-a-data-source"
                        target="_blank"
                        >trackBy</a
                    ></code
                >
                property inherited from
                <code
                    ><a
                        href="https://material.angular.io/cdk/table/overview"
                        target="_blank"
                        >CdkTable</a
                    ></code
                >. The trackBy handler should return a value that uniquely
                identifies each item in the table.
                <br />
                <strong>Note:</strong> When <code>trackBy</code> is used, the
                <code
                    ><a href="../interfaces/ISelection.html" target="_blank"
                        >ISelection</a
                    ></code
                >
                will consist of the trackBy property values only and will not
                contain entire representations of the selected objects. As a
                result, it may be beneficial to keep a separate index mapping
                the selected item IDs to the corresponding objects.
            </li>
            <li>
                Pass the row object to <code>nui-row</code> using the
                <code>rowObject</code> input.
            </li>
            <li>
                Bind to the selection event using the
                <code>(selectionChange)</code> output. In this event table will
                emit
                <code
                    ><a href="../interfaces/ISelection.html" target="_blank"
                        >ISelection</a
                    ></code
                >
                object which should be converted to selected items by calling
                <code>getSelectedItems()</code>
                function from
                <code
                    ><a
                        href="../injectables/SelectorService.html"
                        target="_blank"
                        >SelectorService</a
                    ></code
                >.
            </li>
        </ol>
    `
})
export class TableRowSelectInstructionsComponent {}
