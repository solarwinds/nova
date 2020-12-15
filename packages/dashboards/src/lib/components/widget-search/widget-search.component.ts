import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges } from "@angular/core";
import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";
import { Subject, Subscription } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

import { REFRESH, WIDGET_SEARCH } from "../../services/types";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../types";

import { ISearchOnKeyUp, IWidgetSearchConfiguration } from "./types";

@Component({
    selector: "nui-widget-search",
    templateUrl: "./widget-search.component.html",
    styleUrls: ["./widget-search.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: "pr-3 pl-3 pt-2 pb-2" },
})
export class WidgetSearchComponent implements OnInit, OnDestroy, OnChanges {
    static lateLoadKey = "WidgetSearchComponent";
    static defaultSearchDebounce = 500;

    @Input() public configuration: IWidgetSearchConfiguration;
    @Input() public searchValue: string;

    public searchTerm$ = new Subject<string>();
    public onDestroy$ = new Subject();
    private searchTermSubscription: Subscription;

    constructor(
        @Optional() @Inject(DATA_SOURCE) private dataSource: IDataSource,
        @Inject(PIZZAGNA_EVENT_BUS) public eventBus: EventBus<IEvent>
    ) { }

    public ngOnInit(): void {
        this.registerFilters();
        this.handleSearchTermSubscription(this.configuration?.searchOnKeyUp);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.configuration) {
            const searchCfg = changes.configuration.currentValue;
            this.handleSearchTermSubscription(searchCfg.searchOnKeyUp);
        }
    }

    public onSearchInputChanged(searchTerm: string) {
        if (this.configuration?.searchOnKeyUp?.enabled) {
            this.searchValue = searchTerm;
            this.searchTerm$.next(searchTerm);
        }
    }

    public onSearch(searchTerm: string) {
        this.searchValue = searchTerm;
        this.searchTerm$.next(searchTerm);
    }

    public ngOnDestroy() {
        this.eventBus.getStream(WIDGET_SEARCH).next({
            payload: "",
        });
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private registerFilters() {
        this.dataSource.registerComponent({
            search: {
                componentInstance: {
                    getFilters: () => ({
                        value: this.searchValue,
                    }),
                },
            },
        });
    }

    private handleSearchTermSubscription(searchOnKeyUpCfg: ISearchOnKeyUp | undefined) {
        this.searchTermSubscription?.unsubscribe();
        this.searchTermSubscription = this.searchTerm$
            .pipe(
                takeUntil(this.onDestroy$),
                debounceTime(searchOnKeyUpCfg?.debounceTime || WidgetSearchComponent.defaultSearchDebounce)
            )
            .subscribe((searchTerm) => {
                this.eventBus.getStream(REFRESH).next();
                this.eventBus.getStream(WIDGET_SEARCH).next({
                    payload: searchTerm,
                });
            });
    }
}
