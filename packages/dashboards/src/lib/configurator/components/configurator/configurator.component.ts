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

import { Portal } from "@angular/cdk/portal";
import {
    ChangeDetectorRef,
    Component,
    ComponentRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";

import { OVERLAY_CONTAINER } from "@nova-ui/bits";

import { IWidget } from "../../../components/widget/types";
import { PizzagnaComponent } from "../../../pizzagna/components/pizzagna/pizzagna.component";
import { WidgetTypesService } from "../../../services/widget-types.service";
import { IPizzagna } from "../../../types";
import { PreviewService } from "../../services/preview.service";

/** @ignore */
@Component({
    selector: "nui-configurator",
    templateUrl: "./configurator.component.html",
    styleUrls: ["./configurator.component.less"],
    providers: [
        PreviewService,
        {
            provide: OVERLAY_CONTAINER,
            useValue: ".nui-dashwiz-step--active .configurator-scrollable",
        },
    ],
    host: { class: "nui-configurator" },
})
export class ConfiguratorComponent implements OnInit, OnDestroy {
    public static lateLoadKey = "ConfiguratorComponent";

    @Input() formPortal: Portal<any>;
    @Input() previewWidget: IWidget | null;

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() result = new EventEmitter<IWidget | null>();
    @Output() formPortalAttached = new EventEmitter<ComponentRef<any>>();

    @ViewChild("previewPizzagnaComponent", { static: true })
    previewPizzagnaComponent: PizzagnaComponent;

    public submitError = new Subject();
    private destroy$ = new Subject();

    constructor(
        public widgetTypesService: WidgetTypesService,
        public changeDetector: ChangeDetectorRef
    ) {}

    // ----- LIFECYCLE -----

    public ngOnInit(): void {
        if (!this.previewWidget) {
            this.previewWidget = {
                // TODO: Replace null with an string or change the IWidget prop definition
                // @ts-ignore: Type 'null' is not assignable to type 'string'.
                id: null,
                type: "previewPlaceholder",
                pizzagna:
                    this.widgetTypesService.getWidgetType("previewPlaceholder")
                        .widget,
            };
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // -----

    public handleSubmitError() {
        this.submitError.next();
    }

    public onFormPortalAttached(componentRef: ComponentRef<any>) {
        this.formPortalAttached.emit(componentRef);
    }

    public updateWidget(previewWidget: IWidget | null) {
        this.previewWidget = previewWidget;
        this.changeDetector.markForCheck();
    }

    public formCancel() {
        this.result.next(null);
    }

    public formSubmit() {
        this.result.next(this.previewWidget);
    }

    public onPizzagnaChange(pizzagna: IPizzagna) {
        if (this.previewWidget) {
            this.previewWidget.pizzagna = pizzagna;
        }
    }
}
