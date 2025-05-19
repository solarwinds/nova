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
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
} from "@angular/core";

import { LoggerService } from "@nova-ui/bits";

import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { ErrorNodeKey } from "../../../widget-types/common/widget/types";
import { BaseLayout } from "../../layouts/base-layout";

@Component({
    selector: "nui-widget-body-content",
    templateUrl: "./widget-body-content.component.html",
    standalone: false,
})
export class WidgetBodyContentComponent
    extends BaseLayout
    implements OnChanges, OnInit, OnDestroy
{
    public static lateLoadKey = "WidgetBodyContentComponent";

    /**
     * The component's id
     */
    @Input() public componentId: string;

    /**
     * The pizzagna node to use for the primary content
     */
    @Input() public primaryContent: string;

    /**
     * When this property is populated, the component displays the associated
     * fallback content in place of the primary content
     */
    @Input() public fallbackKey: string;

    /**
     * Map of content keys to pizzagna nodes
     */
    @Input() public fallbackMap: Record<string, string>;

    /**
     * Optional class for styling
     */
    @Input() public elementClass = "";

    @HostBinding("class") public classNames: string;

    public readonly defaultClasses = "w-100";

    constructor(
        changeDetector: ChangeDetectorRef,
        pizzagnaService: PizzagnaService,
        logger: LoggerService
    ) {
        super(changeDetector, pizzagnaService, logger);
    }

    public ngOnInit(): void {
        this.classNames = `${this.defaultClasses} ${this.elementClass}`;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public getNodes(): string[] {
        if (this.fallbackKey) {
            const fallbackContent =
                (this.fallbackMap && this.fallbackMap[this.fallbackKey]) ||
                ErrorNodeKey.ErrorUnknown;
            return [this.primaryContent, fallbackContent];
        }
        return [this.primaryContent];
    }
}
