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
    Inject,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent, LoggerService } from "@nova-ui/bits";

import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { DASHBOARD_EDIT_MODE } from "../../../services/types";
import { PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../types";
import { BaseLayout } from "../../layouts/base-layout";

@Component({
    selector: "nui-widget-body",
    templateUrl: "./widget-body.component.html",
    styleUrls: ["./widget-body.component.less"],
})
export class WidgetBodyComponent
    extends BaseLayout
    implements OnInit, OnDestroy
{
    public static lateLoadKey = "WidgetBodyComponent";

    /**
     * The component's id
     */
    @Input() public componentId: string;

    /**
     * Keeps track of whether the dashboard is in edit mode
     */
    @Input() public editMode = false;

    /**
     * Pizzagna key for the widget body content
     */
    @Input() public content: string;

    /**
     * Optional class for styling
     */
    @Input() public elementClass = "";

    @HostBinding("class") public classNames: string;

    public readonly defaultClasses = "d-flex h-100 w-100";

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        changeDetector: ChangeDetectorRef,
        pizzagnaService: PizzagnaService,
        logger: LoggerService
    ) {
        super(changeDetector, pizzagnaService, logger);
    }

    public ngOnInit() {
        this.classNames = `${this.defaultClasses} ${this.elementClass}`;

        // subscribing to dashboard event to set 'edit mode'
        this.eventBus
            .getStream(DASHBOARD_EDIT_MODE)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((event) => {
                this.pizzagnaService.setProperty(
                    {
                        componentId: this.componentId,
                        pizzagnaKey: PizzagnaLayer.Data,
                        propertyPath: ["editMode"],
                    },
                    !!event.payload
                );
            });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public getNodes = (): string[] => [this.content];
}
