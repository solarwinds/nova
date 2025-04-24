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

import { CdkColumnDef } from "@angular/cdk/table";
import {
    Directive,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from "@angular/core";

import { TableStateHandlerService } from "../table-state-handler.service";
import { ColumnTypes } from "../types";

/**
 * @ignore
 */

@Directive({
    selector: "[nuiColumnDef]",
    providers: [
        { provide: CdkColumnDef, useExisting: TableColumnDefDirective },
    ],
    standalone: false,
})
export class TableColumnDefDirective
    extends CdkColumnDef
    implements OnInit, OnChanges
{
    public get name(): string {
        return super.name;
    }
    @Input("nuiColumnDef")
    public set name(value: string) {
        super.name = value;
    }
    @Input() type: ColumnTypes;
    @Input() columnWidth: number;

    constructor(private tableStateHandlerService: TableStateHandlerService) {
        super();
    }

    public ngOnInit(): void {
        if (this.columnWidth) {
            this.tableStateHandlerService.setColumnWidth(
                this.name,
                this.columnWidth
            );
        }

        if (this.type === "icon") {
            this.tableStateHandlerService.setAlignment(
                this.name,
                "align-center"
            );
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.columnWidth && !changes.columnWidth.firstChange) {
            this.tableStateHandlerService.setColumnWidth(
                this.name,
                changes.columnWidth.currentValue
            );
        }
    }
}
