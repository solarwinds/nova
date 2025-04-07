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

import { fakeAsync, tick } from "@angular/core/testing";
import { FormBuilder, FormGroup } from "@angular/forms";

import { EventBus, IEvent } from "@nova-ui/bits";

import { DynamicComponentCreator } from "../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { PreviewService } from "../../preview.service";
import { EDITOR_PIZZAGNA, TABLE_WIDGET_PREVIEW_PIZZAGNA } from "./mocks.spec";
import { TableScrollTypeConverterService } from "./table-scroll-type-converter.service";
import { ScrollType } from "@nova-ui/dashboards";

class MockComponent {
    public static lateLoadKey = "MockComponent";
    public form: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            paginatorConfiguration: formBuilder.group({
                scrollType: ScrollType.virtual,
                pageSize: 0,
                pageSizeSet: [],
            }),
        });
    }
}

const mockedPaginatorState = {
    pageSize: 20,
    pageSizeSet: [10, 20, 30, 40],
    scrollType: ScrollType.paginator,
};

describe("TableScrollTypeConverterService >", () => {
    const eventBus = new EventBus<IEvent>();
    const formBuilder = new FormBuilder();
    const component = new MockComponent(formBuilder);
    const previewService = new PreviewService();
    const dynamicComponentCreator = new DynamicComponentCreator();
    const pizzagnaService = new PizzagnaService(
        eventBus,
        dynamicComponentCreator
    );

    let service: TableScrollTypeConverterService;

    beforeEach(() => {
        previewService.preview =
            TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration;
        pizzagnaService.pizzagna = EDITOR_PIZZAGNA;
        service = new TableScrollTypeConverterService(
            eventBus,
            previewService,
            pizzagnaService
        );
        service.setComponent(component as any, "");
        service.ngAfterViewInit();
    });

    it("should have component set", () => {
        expect(service.component).toBeDefined();
    });

    it("should properly pass data from preview to form pizzagna", () => {
        const paginatorConfigurationInFormPizzagna =
            pizzagnaService.pizzagna.data.scrollType.properties
                ?.paginatorConfiguration;
        const paginatorConfigurationInPreviewPizzagna =
            TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration.table
                .properties.configuration.paginatorConfiguration;

        const scrollTypeInFormPizzagna =
            pizzagnaService.pizzagna.data.scrollType.properties?.scrollType;
        const scrollTypeInPreviewPizzagna =
            TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration.table
                .properties.configuration.scrollType;

        const hasVirtualScrollInFormPizzagna =
            pizzagnaService.pizzagna.data.scrollType.properties
                ?.hasVirtualScroll;
        const shasVirtualScrollInPreviewPizzagna =
            TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration.table
                .properties.configuration.hasVirtualScroll;

        expect(paginatorConfigurationInPreviewPizzagna).toEqual(
            paginatorConfigurationInFormPizzagna
        );
        expect(scrollTypeInPreviewPizzagna).toEqual(scrollTypeInFormPizzagna);
        expect(shasVirtualScrollInPreviewPizzagna).toEqual(
            hasVirtualScrollInFormPizzagna
        );
    });

    it("should properly update preview from form in editor", fakeAsync(() => {
        spyOn(service, "updatePreview");
        const expectedPreviewPizzagna = {
            ...TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration,
        };
        expectedPreviewPizzagna.table.properties.configuration.paginatorConfiguration =
            mockedPaginatorState;

        component.form
            .get("paginatorConfiguration")
            ?.patchValue(mockedPaginatorState);

        tick(0);
        expect(service.updatePreview).toHaveBeenCalledWith(
            expectedPreviewPizzagna
        );
    }));
});
