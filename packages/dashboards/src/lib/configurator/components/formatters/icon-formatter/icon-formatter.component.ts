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

import { IconService } from "@nova-ui/bits";

import { IHasChangeDetector } from "../../../../types";
import { IFormatterData } from "../types";

@Component({
    template: `
        <div
            *ngIf="isValid"
            class="d-flex align-items-center justify-content-center"
        >
            <nui-icon
                *ngIf="iconFound; else iconNotFound"
                [icon]="data?.value"
            ></nui-icon>
        </div>
        <ng-template #iconNotFound>
            <nui-icon
                title="Unknown icon"
                i18n-title
                iconColor="disabled-gray"
                icon="help"
            ></nui-icon>
        </ng-template>
    `,
})
export class IconFormatterComponent implements OnChanges, IHasChangeDetector {
    static lateLoadKey = "IconFormatterComponent";

    constructor(
        public changeDetector: ChangeDetectorRef,
        public iconService: IconService
    ) {}

    public isValid: boolean = false;
    public iconFound: boolean = true;
    @Input() public data?: IFormatterData;

    public ngOnChanges(): void {
        this.isValid = !!this.data?.value;
        this.iconFound = !!this.iconService.getIconData(this.data?.value);
    }
}
