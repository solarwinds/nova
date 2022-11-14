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

import { TitleCasePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";

import {
    IWidgetTemplateSelector,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { widgets } from "../widgets";
import { AcmeCloneSelectionComponent } from "./acme-clone-selection.component";

@Component({
    selector: "acme-clone-selection",
    templateUrl: "./acme-clone-selection.component.html",
    styleUrls: ["./acme-clone-selection.component.less"],
})
export class AcmeEditWithClonerComponent
    extends AcmeCloneSelectionComponent
    implements IWidgetTemplateSelector, OnInit
{
    static lateLoadKey = "AcmeCloneSelectionComponent";

    constructor(widgetTypesService: WidgetTypesService) {
        super(widgetTypesService);
    }

    public ngOnInit(): void {
        const titleCasePipe = new TitleCasePipe();

        this.widgetItems = widgets.map((w) => {
            const typeDisplay = titleCasePipe.transform(w.type);
            return {
                title: typeDisplay,
                widget: this.widgetTypesService.mergeWithWidgetType(w),
            };
        });
    }
}
