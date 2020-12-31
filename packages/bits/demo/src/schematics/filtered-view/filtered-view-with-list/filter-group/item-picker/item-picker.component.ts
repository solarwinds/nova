import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import {
    ClientSideDataSource,
    DataSourceService,
    ISelection,
    RepeatSelectionMode,
    SorterDirection
} from "@nova-ui/bits";

import { IFilterGroupOption } from "../public-api";

export interface IItemPickerOption {
    value: string;
    displayValue: string;
}

@Component({
    selector: "app-item-picker",
    templateUrl: "./item-picker.component.html",
    providers: [{
        provide: DataSourceService,
        useClass: ClientSideDataSource,
    }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemPickerComponent implements OnInit, AfterViewInit {
    @Input() itemPickerOptions: IItemPickerOption[];
    @Input() selectedValues: string[] = [];

    @Output() selectionChanged: EventEmitter<ISelection> = new EventEmitter();

    public sorter = {
        items: ["value"],
        direction: SorterDirection.ascending,
    };

    public selectionMode = RepeatSelectionMode.multi;

    public selection: ISelection = {
        isAllPages: false,
        include: [],
        exclude: [],
    };

    constructor(@Inject(DataSourceService) public dataSource: DataSourceService<IFilterGroupOption>,
                public changeDetection: ChangeDetectorRef) {
    }

    ngOnInit() {
        (this.dataSource as ClientSideDataSource<IFilterGroupOption>).setData(this.itemPickerOptions);
        this.selection = {
            isAllPages: false,
            include: this.getSelectedOptions(),
            exclude: [],
        };
    }

    ngAfterViewInit(): void {
        this.changeDetection.markForCheck();

        this.dataSource.applyFilters();
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
