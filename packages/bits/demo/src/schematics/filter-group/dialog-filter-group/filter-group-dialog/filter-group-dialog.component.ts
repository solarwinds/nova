import {
    Component,
    EventEmitter,
    Inject,
    Input,
    Output,
} from "@angular/core";
import { NuiActiveDialog, SelectorService } from "@nova-ui/bits";

import { IFilterGroupOption } from "../public-api";

@Component({
    selector: "nui-filter-group-composite-dialog",
    templateUrl: "./filter-group-dialog.component.html",
    styleUrls: ["./filter-group-dialog.component.less"],
})

export class FilterGroupCompositeDialogComponent {
    @Input() title: string;
    @Input() itemPickerOptions: IFilterGroupOption[] = [];
    @Input() selectedValues: string[] = [];

    @Output() dialogClosed: EventEmitter<string[]> = new EventEmitter();

    constructor(@Inject(NuiActiveDialog) private activeDialog: NuiActiveDialog, private selectorService: SelectorService) {}

    public acceptDialogFilters() {
        this.dialogClosed.emit(this.selectedValues);
        this.closeDialog();
    }

    public closeDialog() {
        this.activeDialog.close();
    }

    public onSelectionChanged(selection: IFilterGroupOption[]) {
        this.selectedValues = selection.map(item => item.value);
    }
}
