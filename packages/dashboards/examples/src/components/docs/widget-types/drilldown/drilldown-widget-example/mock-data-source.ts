import { Injectable, OnDestroy } from "@angular/core";
import { DataSourceService, IDataField, IDataSource, IFilters, INovaFilters } from "@nova-ui/bits";
import groupBy from "lodash/groupBy";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { catchError, delay, finalize, map, switchMap, tap } from "rxjs/operators";

import { GRAPH_DATA_MOCK } from "./data-mock";

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class DrilldownDataSource extends DataSourceService<any> implements IDataSource, OnDestroy {
    // This is the ID we'll use to identify the provider
    public static providerId = "DrilldownDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);
    public dataFields: Partial<IDataField>[] = [
        { id: "continent.name", label: "Continent name" },
        { id: "currency", label: "Currency" },
    ];

    private drillState: string[] = [];
    private groupBy: string[];
    private cache: any;
    private applyFilters$ = new Subject<IFilters>();

    constructor() {
        super();

        // TODO: remove Partial in vNext after marking dataType field as optional
        (this.dataFieldsConfig.dataFields$ as BehaviorSubject<Partial<IDataField>[]>).next(this.dataFields);

        this.applyFilters$.pipe(
            switchMap(filters => this.getData(filters))
        ).subscribe(async (res) => {
            this.outputsSubject.next(await this.getFilteredData(res));
        });
    }

    private groupedDataHistory: any[] = [];

    // In this example, getFilteredData is invoked every 10 minutes (Take a look at the refresher
    // provider definition in the widget configuration below to see how the interval is set)
    public async getFilteredData(data: any): Promise<any> {
        return of(data).pipe(
            map(countries => {
                const widgetInput = this.getOutput(countries);

                if (this.isDrillDown()) {
                    const activeDrillLvl = this.drillState.length;
                    const group = this.groupBy[activeDrillLvl];
                    const [lastGroupedValue, groupedData] = this.getTransformedDataForGroup(widgetInput, group);

                    this.groupedDataHistory.push(lastGroupedValue);

                    return groupedData;
                }

                return widgetInput;
            })
        ).toPromise();
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }

    // redefine parent method
    public async applyFilters(): Promise<void> {
        this.applyFilters$.next(this.getFilters());
    }

    private getData(filters: INovaFilters): Observable<any> {
        this.drillState = filters.drillstate?.value;
        this.groupBy = filters.group?.value;

        this.busy.next(true);

        return of(this.cache || GRAPH_DATA_MOCK)
                .pipe(
                    delay(1000),
                    tap(data => this.cache = data),
                    map(data => data.data.countries),
                    catchError(e => of([])),
                    finalize(() => this.busy.next(false))
                );
    }

    private getTransformedDataForGroup(data: any, groupName: string) {
        const groupedDict = groupBy(data, groupName);
        const dataArr = Object.keys(groupedDict).map(property => ({
            id: property,
            label: property,
            // TODO: apply groups mapping here
            statuses: [
                { key: "state_ok", value: groupedDict[property].length },
                { key: "status_unreachable", value: generateNumberUpTo(100000) },
                { key: "status_warning", value: generateNumberUpTo(10000) },
                { key: "status_unknown", value: generateNumberUpTo(1000) },
            ],
        }));

        return [groupedDict, dataArr];
    }

    private isHome(): boolean {
        return !this.drillState || (this.drillState.length === 0);
    }

    private isBack(): boolean {
        return (this.groupedDataHistory.length > this.drillState?.length) && !this.isHome();
    }

    private isDrillDown(): boolean {
        return this.drillState?.length !== this.groupBy?.length;
    }

    private getOutput(data: any) {
        if (this.isHome()) {
            this.groupedDataHistory.length = 0;
        }

        if (this.isBack()) {
            this.groupedDataHistory.length = this.groupedDataHistory.length - 1;
        }

        const lastHistoryValue = getLast(this.groupedDataHistory);

        if (!lastHistoryValue) {
            return data;
        }

        return lastHistoryValue[getLast(this.drillState)] || lastHistoryValue;
    }
}

const getLast = (arr: any[]) => arr[arr.length - 1];
const generateNumberUpTo = (upperLimit: number): number => Math.floor((Math.random() * upperLimit) + 1);
