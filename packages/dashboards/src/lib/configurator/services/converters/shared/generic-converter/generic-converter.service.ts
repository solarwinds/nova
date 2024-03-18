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

import { Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import get from "lodash/get";
import pick from "lodash/pick";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";

import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { PreviewService } from "../../../preview.service";
import { BaseConverter } from "../../base-converter";
import { IConverterFormPartsProperties } from "../../types";

@Injectable()
export class GenericConverterService extends BaseConverter {
    private formParts: IConverterFormPartsProperties[];

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        previewService: PreviewService,
        pizzagnaService: PizzagnaService
    ) {
        super(eventBus, previewService, pizzagnaService);
    }

    public updateConfiguration(properties: {
        formParts: IConverterFormPartsProperties[];
    }): void {
        if (properties && properties.formParts) {
            this.formParts = properties.formParts;
        }
    }

    public buildForm(): void {
        console.log('build generic')
        const preview = this.getPreview();

        const updatedPizzagna = this.formParts.reduce((res, v) => {
            // TODO: Define correct index type
            const previewSlice: Record<string, any> = get(
                preview,
                v.previewPath
            );

            if (previewSlice) {
                for (const key of v.keys) {
                    if (previewSlice[key] !== undefined) {
                        res = immutableSet(
                            res,
                            `${PizzagnaLayer.Data}.${this.componentId}.properties.${key}`,
                            previewSlice[key]
                        );
                    }
                }
            }

            return res;
        }, this.pizzagnaService.pizzagna);
        this.updateFormPizzagna(updatedPizzagna);
    }

    public toPreview(form: FormGroup): void {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((formData) => {
                const updatedPreview = this.formParts.reduce((p, v) => {
                    const outPath = v.previewOutputPath || v.previewPath;
                    const fromPreview = get(p, outPath);
                    const fromForm = pick(formData, v.keys);
                    const merged = { ...fromPreview, ...fromForm };

                    return immutableSet(p, outPath, merged);
                }, this.getPreview());

                this.updatePreview(updatedPreview);
            });
    }
}
