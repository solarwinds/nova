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
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { IEvent, LoggerService } from "@nova-ui/bits";

import { BaseLayout } from "../../../components/layouts/base-layout";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { IHasForm } from "../../../types";

@Component({
    selector: "nui-widget-configurator-section",
    templateUrl: "./widget-configurator-section.component.html",
    styleUrls: ["./widget-configurator-section.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { class: "nui-widget-configurator-section" },
})
export class WidgetConfiguratorSectionComponent
    extends BaseLayout
    implements OnInit, OnDestroy, IHasForm
{
    public static lateLoadKey = "WidgetConfiguratorSectionComponent";

    @Input() headerTextTemplate: TemplateRef<any>;
    @Input() headerButtonsTemplate: TemplateRef<any>;

    @Input() nodes: string[] = [];
    @Input() headerText: string = "";

    @Output() formReady = new EventEmitter<FormGroup>();
    @Output() formDestroy = new EventEmitter<FormGroup>();

    public form: FormGroup;

    constructor(
        changeDetector: ChangeDetectorRef,
        pizzagnaService: PizzagnaService,
        logger: LoggerService,
        private formBuilder: FormBuilder
    ) {
        super(changeDetector, pizzagnaService, logger);
    }

    public getNodes(): string[] {
        return this.nodes;
    }

    public ngOnInit() {
        this.form = this.formBuilder.group({});
    }

    public onEvent(componentId: string, event: IEvent) {
        if (event.id === "formReady") {
            this.addFormGroup(componentId, event.payload);
        }
        if (Object.keys(this.form.controls).length === this.getNodes().length) {
            this.formReady.emit(this.form);
        }
    }

    public addFormGroup(name: string, formGroup: FormGroup) {
        this.form.addControl(name, formGroup);
    }

    public ngOnDestroy(): void {
        this.formDestroy.emit(this.form);

        // Invoke super.ngOnDestroy to ensure that any base class observables are unsubscribed.
        super.ngOnDestroy();
    }
}
