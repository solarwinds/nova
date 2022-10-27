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
    OnChanges,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import {
    ControlContainer,
    FormGroup,
    FormGroupDirective,
} from "@angular/forms";

import { EventBus, IEvent, LoggerService } from "@nova-ui/bits";

import { BaseLayout } from "../../../components/layouts/base-layout";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS } from "../../../types";

/**
 * This component registers multiple nested form groups in a parent form
 */
@Component({
    selector: "nui-form-stack",
    templateUrl: "./form-stack.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: FormGroupDirective,
        },
    ],
})
export class FormStackComponent
    extends BaseLayout
    implements OnInit, OnChanges
{
    static lateLoadKey = "FormStackComponent";

    @Input() nodes: [];

    @HostBinding("class")
    public elementClass = "";

    public form: FormGroup;

    constructor(
        changeDetector: ChangeDetectorRef,
        pizzagnaService: PizzagnaService,
        logger: LoggerService,
        public formDirective: FormGroupDirective,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>
    ) {
        super(changeDetector, pizzagnaService, logger);
    }

    public ngOnInit() {
        this.form = this.formDirective.form;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }

    public onEvent(componentId: string, event: IEvent) {
        if (event.id === "formReady") {
            this.addFormGroup(componentId, event.payload);
        }
    }

    public addFormGroup(name: string, formGroup: FormGroup) {
        this.form.addControl(name, formGroup);
    }

    public getNodes(): string[] {
        return this.nodes;
    }
}
