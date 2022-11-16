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

import { AfterViewInit, Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";

import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../../types";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

@Injectable()
export class TableFiltersConverterService
    extends BaseConverter
    implements AfterViewInit
{
    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        previewService: PreviewService,
        pizzagnaService: PizzagnaService
    ) {
        super(eventBus, previewService, pizzagnaService);
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }

    public buildForm(): void {
        let formPizzagna = this.pizzagnaService.pizzagna;

        const table = this.getPreview()?.table;
        const columns = table?.properties?.configuration?.columns;
        const sorterConfiguration =
            table?.properties?.configuration?.sorterConfiguration;

        formPizzagna = immutableSet(
            formPizzagna,
            `${PizzagnaLayer.Data}.filters.properties.columns`,
            columns
        );
        formPizzagna = immutableSet(
            formPizzagna,
            `${PizzagnaLayer.Data}.filters.properties.sorterConfiguration`,
            sorterConfiguration
        );

        this.updateFormPizzagna(formPizzagna);
    }

    public toPreview(form: FormGroup): void {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((filters) => {
                let preview = this.getPreview();
                preview = immutableSet(
                    preview,
                    "table.properties.configuration.sorterConfiguration",
                    filters.sorterConfiguration
                );
                this.updatePreview(preview);
                // we need to update form with columns that are available
                this.buildForm();
            });
    }
}
