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

import { AfterViewInit, Inject, Injectable, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

import { EventBus, IEvent } from "@nova-ui/bits";

import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import {
    ISetPropertyPayload,
    SET_PROPERTY_VALUE,
} from "../../../services/types";
import { IPizzagna, IPizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../types";
import { PreviewService } from "../preview.service";
import { IConfiguratorConverter } from "./types";

@Injectable()
export abstract class BaseConverter
    implements AfterViewInit, IConfiguratorConverter, OnDestroy
{
    public component: any;
    public componentId: string;

    public destroy$ = new Subject<void>();

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>,
        private previewService: PreviewService,
        protected pizzagnaService: PizzagnaService
    ) {}

    ngAfterViewInit(): void {
        this.buildForm();

        this.toPreview(this.component.form);
    }

    public abstract buildForm(): void;

    public abstract toPreview(form: FormGroup): void;

    public setComponent(component: any, componentId: string) {
        this.component = component;
        this.componentId = componentId;
    }

    public getPreview(): IPizzagnaLayer {
        return this.previewService.preview;
    }

    public updatePreview(preview: IPizzagnaLayer) {
        this.previewService.preview = preview;
    }

    public updateFormPizzagna(pizzagna: IPizzagna) {
        this.pizzagnaService.updatePizzagna(pizzagna);
        this.eventBus.getStream(SET_PROPERTY_VALUE).next({
            payload: { path: "", value: pizzagna } as ISetPropertyPayload,
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
