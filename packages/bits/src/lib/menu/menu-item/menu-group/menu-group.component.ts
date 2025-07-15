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

import { Component, Input, ViewEncapsulation } from "@angular/core";

/** @ignore */
@Component({
    selector: "nui-menu-group",
    template: `
        <ng-container *ngIf="header">
            <div
                class="nui-menu-item nui-menu-item--header"
                (click)="stopClickPropagation($event)"
            >
                {{ header }}
            </div>
        </ng-container>
        <ng-content></ng-content>
        <div
            (click)="stopClickPropagation($event)"
            class="nui-menu-group-divider--container"
        >
            <nui-divider size="extra-small"></nui-divider>
        </div>
    `,
    styleUrls: ["./menu-group.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: { role: "group" },
    standalone: false,
})
export class MenuGroupComponent {
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() header?: string;

    public stopClickPropagation(event: MouseEvent): void {
        event.stopPropagation();
    }
}
