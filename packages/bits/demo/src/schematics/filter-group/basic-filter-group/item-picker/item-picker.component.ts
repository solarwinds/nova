import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from "@angular/core";
import {
    DataSourceService,
    IFilteringOutputs,
    ISelection,
    LocalFilteringDataSource,
    RepeatSelectionMode,
    SorterDirection
} from "@nova-ui/bits";
import { Subscription } from "rxjs";

import { IFilterGroupOption } from "../public-api";
// import { ListCompositeComponent } from "../list/list.component";

export interface IItemPickerOption {
    value: string;
    displayValue: string;
}

@Component({
    selector: "nui-item-picker-composite",
    templateUrl: "./item-picker.component.html",
    providers: [{
        provide: DataSourceService,
        useClass: LocalFilteringDataSource,
    }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemPickerCompositeComponent implements AfterViewInit, OnInit, OnDestroy {
    @Input() itemPickerOptions: IItemPickerOption[];
    @Input() selectedValues: string[] = [];

    @Output() selectionChanged: EventEmitter<ISelection> = new EventEmitter();

    public sorter = {
        items: ["value"],
        direction: SorterDirection.ascending,
    };

    public selectionMode = RepeatSelectionMode.multi;

    public filteringState: IFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        paginator: {
            total: undefined,
        },
    };

    public selection: ISelection = {
        isAllPages: false,
        include: [],
        exclude: [],
    };

    public page: number = 1;

    // @ViewChild("list", {static: false}) listComposite: ListCompositeComponent;

    private outputsSubscription: Subscription;

    constructor(@Inject(DataSourceService) public dataSource: DataSourceService<IFilterGroupOption>,
                public changeDetection: ChangeDetectorRef) {
    }

    ngOnInit() {
        (this.dataSource as LocalFilteringDataSource<IFilterGroupOption>).setData(this.itemPickerOptions);
        this.selection = {
            isAllPages: false,
            include: this.getSelectedOptions(),
            exclude: [],
        };
    }

    async ngAfterViewInit() {
        this.changeDetection.markForCheck();

        // this.dataSource.registerComponent(this.listComposite.getFilterComponents());

        this.outputsSubscription = this.dataSource.outputsSubject.subscribe((data: IFilteringOutputs) => {
            this.filteringState = data;
        });

        await this.dataSource.applyFilters();
    }

    public ngOnDestroy() {
        if (this.outputsSubscription) {
            this.outputsSubscription.unsubscribe();
        }
    }

    public applyFilters() {
        this.dataSource.applyFilters();
    }

    public onSelection(selection: ISelection) {
        this.selection = selection;
        this.selectionChanged.emit(this.selection);
    }

    public getSelectedOptions(): IFilterGroupOption[] {
        return this.itemPickerOptions.filter(item => this.selectedValues.indexOf(item.value) !== -1);
    }
}
