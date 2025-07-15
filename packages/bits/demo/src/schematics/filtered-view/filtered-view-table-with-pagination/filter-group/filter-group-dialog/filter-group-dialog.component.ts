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

import { Component, EventEmitter, Inject, Input, Output, input } from "@angular/core";

import { ISelection, NuiActiveDialog, SelectorService } from "@nova-ui/bits";

import { IFilterGroupOption } from "../public-api";

@Component({
    selector: "app-filter-group-dialog",
    templateUrl: "./filter-group-dialog.component.html",
    styleUrls: ["./filter-group-dialog.component.less"],
    standalone: false,
})
export class FilterGroupDialogComponent {
    readonly title = input<string>(undefined!);
    readonly itemPickerOptions = input<IFilterGroupOption[]>([]);
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() selectedValues: string[] = [];

    @Output() dialogClosed: EventEmitter<string[]> = new EventEmitter();

    constructor(
        @Inject(NuiActiveDialog) private activeDialog: NuiActiveDialog,
        private selectorService: SelectorService
    ) {}

    public acceptDialogFilters(): void {
        this.dialogClosed.emit(this.selectedValues);
        this.closeDialog();
    }

    public closeDialog(): void {
        this.activeDialog.close();
    }

    public onSelectionChanged(selection: ISelection): void {
        const selectedOptions = this.selectorService.getSelectedItems(
            selection,
            this.itemPickerOptions()
        );
        this.selectedValues = selectedOptions.map((item) => item.value);
    }
}
