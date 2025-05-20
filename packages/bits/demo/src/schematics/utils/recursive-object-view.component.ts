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

import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import _isObject from "lodash/isObject";
import _sortBy from "lodash/sortBy";

@Component({
    selector: "nui-recursive-object-view",
    template: `
        <div class="ml-5" *ngFor="let key of orderOfKeys">
            <div *ngIf="checkInstance(key); else notObject">
                <nui-expander [header]="key" icon="group">
                    <nui-recursive-object-view
                        [object]="object[key]"
                        [objectTemplate]="objectTemplate"
                        [notObjectTemplate]="notObjectTemplate"
                    >
                        <ng-container
                            [ngTemplateOutlet]="objectTemplate"
                            [ngTemplateOutletContext]="{ item: object[key] }"
                        ></ng-container>
                    </nui-recursive-object-view>
                </nui-expander>
            </div>
            <ng-template #notObject>
                <ng-container
                    [ngTemplateOutlet]="notObjectTemplate"
                    [ngTemplateOutletContext]="{ item: key }"
                ></ng-container>
            </ng-template>
        </div>
    `,
})
export class RecursiveObjectViewComponent implements OnInit {
    @Input() object: any;
    @Input() objectTemplate: TemplateRef<string>;
    @Input() notObjectTemplate: TemplateRef<string>;

    public orderOfKeys: Array<string>;

    public ngOnInit(): void {
        this.orderOfKeys = _sortBy(
            Object.keys(this.object),
            (key: string) => key.length
        );
    }

    public checkInstance(key: string): boolean {
        return _isObject(this.object[key]);
    }
}
