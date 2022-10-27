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

import { fakeAsync, flush, tick } from "@angular/core/testing";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

import { EventBus, IEvent } from "@nova-ui/bits";

import { DynamicComponentCreator } from "../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { PreviewService } from "../../preview.service";
import { EDITOR_PIZZAGNA, TABLE_WIDGET_PREVIEW_PIZZAGNA } from "./mocks";
import { TableColumnsConverterService } from "./table-columns-converter.service";

class MockComponent {
    public static lateLoadKey = "MockComponent";
    public form: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            columns: formBuilder.array([]),
        });
    }
}

const mockedColumnsFormValue = {
    id: "column1",
    properties: {
        description: {
            label: $localize`No`,
            isActive: true,
        },
        presentation: {
            dataFieldIds: ["position"],
            formatterId: "RawFormatterComponent",
        },
    },
};

describe("TableColumnsConverterService >", () => {
    const eventBus = new EventBus<IEvent>();
    const formBuilder = new FormBuilder();
    const component = new MockComponent(formBuilder);
    const previewService = new PreviewService();
    const dynamicComponentCreator = new DynamicComponentCreator();
    const pizzagnaService = new PizzagnaService(
        eventBus,
        dynamicComponentCreator
    );

    let service: TableColumnsConverterService;

    beforeEach(fakeAsync(() => {
        spyOn(pizzagnaService, "createComponentsFromTemplate");
        previewService.preview =
            TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration;
        pizzagnaService.pizzagna = EDITOR_PIZZAGNA;
        service = new TableColumnsConverterService(
            eventBus,
            previewService,
            pizzagnaService
        );
        service.setComponent(component as any, "");
        service.ngAfterViewInit();
        service.buildForm();
        flush();
    }));

    it("should have component set", () => {
        expect(service.component).toBeDefined();
    });

    it("should properly build form", () => {
        const columnsInFormPizzagna =
            pizzagnaService.pizzagna.data.columns.properties?.columns;
        const columnsInPreviewPizzagna =
            TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration.table
                .properties.configuration.columns;

        expect(columnsInFormPizzagna).toEqual(columnsInPreviewPizzagna);
    });

    xit("should properly update preview", fakeAsync(() => {
        spyOn(service, "updatePreview");
        const expectedPreviewPizzagna = {
            ...TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration,
        };
        expectedPreviewPizzagna.table.properties.configuration.columns = [
            {
                id: "column1",
                label: $localize`No`,
                isActive: true,
                dataFieldIds: ["position"],
                formatterId: "RawFormatterComponent",
            },
        ];
        (component.form.get("columns") as FormArray).push(
            formBuilder.control(mockedColumnsFormValue)
        );
        tick(0);

        expect(service.updatePreview).toHaveBeenCalledWith(
            expectedPreviewPizzagna
        );
    }));
});
