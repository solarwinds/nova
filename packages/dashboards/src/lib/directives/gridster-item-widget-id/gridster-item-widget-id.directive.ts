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

import {
    Directive,
    Host,
    Input,
    OnChanges,
    Self,
    SimpleChanges,
} from "@angular/core";
import { GridsterItemComponent } from "angular-gridster2";

/**
 * This directive assigns a "widgetId" property to host gridster item. We need it there because moving and resizing the widget with gridster only contains
 * gridster position data and gridster component payload, so we need to identify which widget that event belongs to.
 */
@Directive({
    selector: "[nuiGridsterItemWidgetId]",
})
export class GridsterItemWidgetIdDirective implements OnChanges {
    @Input() nuiGridsterItemWidgetId: string;

    constructor(@Host() @Self() private gridsterItem: GridsterItemComponent) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.nuiGridsterItemWidgetId) {
            (this.gridsterItem as any).widgetId = this.nuiGridsterItemWidgetId;
        }
    }
}
