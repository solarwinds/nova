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
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";

import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { WidgetConfigurationService } from "../../services/widget-configuration.service";
import { WidgetTypesService } from "../../services/widget-types.service";
import { IPizzagna } from "../../types";
import { IWidget } from "./types";

@Component({
    selector: "nui-widget",
    templateUrl: "./widget.component.html",
    styleUrls: ["./widget.component.less"],
    providers: [WidgetConfigurationService],
    host: { class: "nui-widget" },
})
export class WidgetComponent implements OnChanges {
    @Input() widget: IWidget;
    @Output() widgetChange = new EventEmitter<IWidget>();

    public rootNode = DEFAULT_PIZZAGNA_ROOT;

    constructor(
        private widgetConfigurationService: WidgetConfigurationService,
        private widgetTypesService: WidgetTypesService
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.widget) {
            const type = this.widget.type;
            const previousType =
                changes.widget.previousValue &&
                changes.widget.previousValue.type;
            if (previousType !== type) {
                const widgetType = this.widgetTypesService.getWidgetType(
                    type,
                    this.widget.version
                );
                this.rootNode =
                    widgetType?.paths?.widget?.root || DEFAULT_PIZZAGNA_ROOT;
            }
            this.widgetConfigurationService.updateWidget(this.widget);
        }
    }

    public onPizzagnaChange(pizzagna: IPizzagna) {
        this.widgetChange.emit({
            ...this.widget,
            pizzagna: pizzagna,
        });
    }
}
