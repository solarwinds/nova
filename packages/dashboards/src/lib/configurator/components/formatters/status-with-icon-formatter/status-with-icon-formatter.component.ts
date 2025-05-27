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

import { ChangeDetectorRef, Component, Input, OnChanges } from "@angular/core";

import { IHasChangeDetector } from "../../../../types";

@Component({
    selector: "nui-dashboards-status-icon-formatter",
    template: `
        <ng-container *ngIf="isValid">
            <div
                class="nui-text-label align-items-center status-icon-formatter"
            >
                <span class="nui-text-ellipsis text-right pl-3">{{
                    data.data
                }}</span>
                <nui-icon
                    [icon]="data.icon"
                    class="nui-icon nui-icon-line-height mx-2"
                ></nui-icon>
                <div *ngIf="data?.link; else noLink">
                    <a
                        class="nui-text-link-small nui-text-ellipsis link"
                        (click)="$event.stopPropagation()"
                        [href]="data?.link"
                        rel="noopener noreferrer"
                        [title]="data.name"
                    >
                        {{ data.name }}
                    </a>
                </div>
                <ng-template #noLink>
                    <span class="nui-text-ellipsis" [style.font-size.px]="11">{{
                        data.name
                    }}</span>
                </ng-template>
            </div>
        </ng-container>
    `,
    styles: [
        `
            .status-icon-formatter {
                display: grid;
                grid-template-columns: 50px auto minmax(114px, 1fr);
            }
        `,
    ],
})
export class StatusWithIconFormatterComponent
    implements OnChanges, IHasChangeDetector
{
    static lateLoadKey = "StatusWithIconFormatterComponent";

    constructor(public changeDetector: ChangeDetectorRef) {}

    public isValid: boolean = false;
    @Input() data: {
        name: string;
        icon: string;
        data: number[];
        link?: string;
    };

    public ngOnChanges(): void {
        this.isValid = !!(
            this.data &&
            this.data.icon &&
            this.data.name &&
            this.data.data
        );
    }
}
