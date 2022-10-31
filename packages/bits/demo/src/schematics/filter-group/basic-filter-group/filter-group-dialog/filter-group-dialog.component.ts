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

import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";

import { ISelection, NuiActiveDialog, SelectorService } from "@nova-ui/bits";

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

    constructor(
        @Inject(NuiActiveDialog) private activeDialog: NuiActiveDialog,
        private selectorService: SelectorService
    ) {}

    public acceptDialogFilters() {
        this.dialogClosed.emit(this.selectedValues);
        this.closeDialog();
    }

    public closeDialog() {
        this.activeDialog.close();
    }

    public onSelectionChanged(selection: ISelection) {
        const selectedOptions = this.selectorService.getSelectedItems(
            selection,
            this.itemPickerOptions
        );
        this.selectedValues = selectedOptions.map((item) => item.value);
    }
}
