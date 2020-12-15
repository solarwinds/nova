import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { AfterViewInit, ChangeDetectionStrategy, Component, TrackByFunction, ViewChild } from "@angular/core";
import {
    ClientSideDataSource,
    IFilteringOutputs,
    TableStickyHeaderDirective
} from "@nova-ui/bits";
import sample from "lodash/sample";
import { Observable } from "rxjs";
import { map, startWith, switchMap, tap } from "rxjs/operators";

import { IRandomUserTableModel } from "..";

@Component({
    selector: "nui-table-virtual-scroll-sticky-header-example",
    templateUrl: "./table-virtual-scroll-sticky-header-example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ClientSideDataSource],
})
export class TableVirtualScrollStickyHeaderExampleComponent implements AfterViewInit {
    @ViewChild(CdkVirtualScrollViewport) public viewport: CdkVirtualScrollViewport;
    // Note: Used only for demo purposes
    @ViewChild(TableStickyHeaderDirective) public stickyHeaderDirective: TableStickyHeaderDirective;

    // Note: Mock items list is used to fake that the data is already loaded
    // and let CDK Viewport perform the scrolling on a known number of items
    public placeholderItems: undefined[] = [];
    public visibleItems$: Observable<IRandomUserTableModel[]>;
    // The dynamically changed array of items to render by the table
    public displayedColumns: string[] = ["no", "nameTitle", "nameFirst", "nameLast", "city", "postcode"];

    public makeSticky: boolean = true;
    public itemSize: number = 40;
    public gridHeight = 400;
    // trackBy handler used to identify uniquely each item in the table
    public trackByNo: TrackByFunction<IRandomUserTableModel> = (index, item) => item?.no;

    constructor(public dataSourceService: ClientSideDataSource<IRandomUserTableModel>) {
        // Note: Initiating data source with data to be displayed
        this.dataSourceService.setData(generateUsers(100000));
    }

    public ngAfterViewInit() {
        this.dataSourceService.componentTree = {
            // Note: Using paginator as filter to be able to get specific range
            paginator: {
                componentInstance: {
                    getFilters: () => ({
                        value: this.viewport.getRenderedRange(),
                    }),
                },
            },
        };

        // Note: Creating a stream of visible items to be bound to the table and increase the performance
        this.visibleItems$ = this.viewport.renderedRangeStream.pipe(startWith({ start: 0, end: 10 }),
            // Note: On range change applying filters
            tap(() => this.dataSourceService.applyFilters()),
            // Subscribing to the filter results transforming and merging them into the stream
            switchMap(() => this.dataSourceService.outputsSubject.pipe(
                map((result: IFilteringOutputs) => {
                    // Updating mock items list
                    if (this.placeholderItems.length !== result.paginator.total) {
                        this.placeholderItems = Array.from({ length: result.paginator.total });
                    }
                    // Mapping the values to array to be able to bind them to the table dataSource
                    return result.repeat.itemsSource;
                })
            )));
    }

    // Note: Used only for demo purposes
    updateStickyState(state: boolean) {
        this.stickyHeaderDirective.tableStickyHeader = state;
        this.makeSticky = state;
    }
}

export function generateUsers(length: number): IRandomUserTableModel[] {
    return Array.from({ length }).map((obj: unknown, id: number) => {
        const personName = sample(["Josh", "Lukas", "Blake", "Frantz", "Dima", "Serhii", "Vita", "Vlad", "Ivan", "Dumitru"]) || "Josh";
        return ({
            no: id,
            postcode: id * 1000000 * id,
            cell: "0000",
            city: sample(["Bucharest", "Kiev", "Austin", "Brno", "Frankfurt pe Main", "Sutton-under-Whitestonecliffe", "Vila Bela da Santíssima Trindade"]) || "Bucharest",
            country: "Unknown",
            email: `${ personName.toLocaleLowerCase() }@@sw.com`,
            gender: "Unknown",
            nameFirst: personName,
            nameLast: "UnknownLast",
            nameTitle: "Sir.",
        });
    });
}
