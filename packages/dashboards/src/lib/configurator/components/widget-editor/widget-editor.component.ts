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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import get from "lodash/get";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IEvent } from "@nova-ui/bits";

import { PizzagnaComponent } from "../../../pizzagna/components/pizzagna/pizzagna.component";
import { IPreviewEventPayload, PREVIEW_EVENT } from "../../../services/types";
import {
    IHasChangeDetector,
    IPizzagna,
    IPizzagnaLayer,
    PizzagnaLayer,
} from "../../../types";
import { PreviewService } from "../../services/preview.service";
import { ConfiguratorComponent } from "../configurator/configurator.component";
import { IDashwizWaitEvent } from "../wizard/types";

@Component({
    selector: "nui-widget-editor",
    templateUrl: "./widget-editor.component.html",
    host: { class: "d-flex flex-column h-100" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetEditorComponent
    implements OnInit, OnDestroy, IHasChangeDetector
{
    public static lateLoadKey = "WidgetEditorComponent";
    public static readonly TITLE_PATH = "header.properties.title";

    @Input() formPizzagna: IPizzagna;
    @Input() formRoot: string;

    private _formPizzagnaComponent: PizzagnaComponent;

    @ViewChild("formPizzagnaComponent", { static: false })
    public set formPizzagnaComponent(value: PizzagnaComponent) {
        value?.eventBus
            ?.getStream(PREVIEW_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IEvent<IPreviewEventPayload>) => {
                const payload = event.payload;
                // TODO: Ensure that we have payload
                this.configurator?.previewPizzagnaComponent?.eventBus
                    // @ts-ignore
                    ?.getStream(payload.id)
                    // @ts-ignore
                    .next(payload.payload);
            });
        this._formPizzagnaComponent = value;
    }

    public form: FormGroup;
    public navigationControl: BehaviorSubject<IDashwizWaitEvent> =
        new BehaviorSubject<IDashwizWaitEvent>({
            busyState: { busy: false },
            allowStepChange: true,
        });
    public busy = false;
    public configuratorTitle: string;

    private destroy$ = new Subject();

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private previewService: PreviewService,
        private configurator: ConfiguratorComponent
    ) {
        this.form = this.formBuilder.group({});
    }

    public ngOnInit() {
        // TODO: Reconsider this
        // @ts-ignore: We can depend on preview being undefined somewhere
        this.previewService.preview =
            this.configurator.previewWidget?.pizzagna[
                PizzagnaLayer.Configuration
            ];

        this.previewService.previewChanged
            .pipe(takeUntil(this.destroy$))
            .subscribe((pizzagna: IPizzagnaLayer) => {
                this.onPreviewPizzagnaUpdate(pizzagna);
                this.changeDetector.detectChanges();
            });

        this.configurator.submitError
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.toggleBusy();
            });
        this.changeDetector.detectChanges();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // --------------------------------------------------------------------------------

    public onPreviewPizzagnaUpdate(configLayer: IPizzagnaLayer) {
        const previewWidget = {
            ...this.configurator.previewWidget,
            pizzagna: {
                ...this.configurator.previewWidget?.pizzagna,
                [PizzagnaLayer.Configuration]: configLayer,
            },
        };
        // TODO: Make previewWidget to be assignable to IWidget
        // @ts-ignore: Type '{ pizzagna: { configuration: IPizzagnaLayer; }; }' is missing the following properties from type 'IWidget': id, type
        this.configurator.updateWidget(previewWidget);
        const widgetTitle = get(
            configLayer,
            WidgetEditorComponent.TITLE_PATH,
            ""
        );
        this.configuratorTitle = $localize`Editing ${widgetTitle}`;
    }

    public onFinish() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            // is used to trigger valueChanges to detect changes in forms
            // as form is invalid and marking as touched doesn't trigger neither statusChanges nor valueChanges
            // and validation messages and styles are not applied in that cases
            this.form.patchValue(this.form.value);
            this.form.updateValueAndValidity({
                onlySelf: false,
                emitEvent: true,
            });
            return;
        }

        this.toggleBusy();
        this.configurator.formSubmit();
    }

    public onCancel() {
        this.configurator.formCancel();
    }

    private toggleBusy() {
        this.busy = !this.busy;
        this.navigationControl.next({
            busyState: { busy: this.busy },
            allowStepChange: !this.busy,
        });
    }
}
