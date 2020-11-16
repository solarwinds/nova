import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import {
    DataSourceService,
    LocalFilteringDataSource,
    RepeatSelectionMode,
} from "@solarwinds/nova-bits";

import { IFilterGroupOption } from "../public-api";

export interface IItemPickerOption {
    value: string;
    displayValue: string;
}

@Component({
    selector: "app-item-picker-composite",
    templateUrl: "./item-picker.component.html",
    styleUrls: ["./item-picker.component.less"],
    providers: [{
        provide: DataSourceService,
        useClass: LocalFilteringDataSource,
    }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ItemPickerCompositeComponent implements OnInit {
    @Input() itemPickerOptions: IFilterGroupOption[];
    @Input() selectedValues: string[] = [];

    @Output() selectionChanged: EventEmitter<IFilterGroupOption[]> = new EventEmitter();

    public selectionMode = RepeatSelectionMode.multi;
    public selectedOptions: IFilterGroupOption[] = [];


    constructor(@Inject(DataSourceService) public dataSource: DataSourceService<IFilterGroupOption>) {
    }

    ngOnInit() {
        (this.dataSource as LocalFilteringDataSource<IFilterGroupOption>).setData(this.itemPickerOptions);
        this.selectedOptions = this.getSelectedOptions();
    }

    public onSelection(selection: IFilterGroupOption[]) {
        this.selectedOptions = selection;
        this.selectionChanged.emit(selection);
    }

    public getSelectedOptions(): IFilterGroupOption[] {
        return this.itemPickerOptions.filter(item => this.selectedValues.indexOf(item.value) !== -1);
    }
}
