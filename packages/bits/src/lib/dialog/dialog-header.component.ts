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

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { SeverityLevels } from "./public-api";

/**
 * @ignore
 */

@Component({
    selector: "nui-dialog-header",
    templateUrl: "./dialog-header.component.html",
    standalone: false
})
export class DialogHeaderComponent implements OnInit {
    /**
     * Title of the dialog.
     */
    @Input() title: string;
    /**
     * Severity of the dialog. Possible values: 'critical', 'warning', 'info'.
     */
    @Input() severity: SeverityLevels;
    /**
     * Closes dialog on cross click.
     */
    @Output() closed = new EventEmitter();

    public severityClass = "";
    public severityIcon = "";

    public ngOnInit(): void {
        if (this.severity) {
            this.severityClass = `dialog-header-${this.severity}`;
            this.severityIcon = `severity_${this.severity}`;
        }
    }

    public innerClose(event: any): void {
        this.closed.emit(event);
    }
}
