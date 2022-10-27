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

import { FormBuilder, FormGroup } from "@angular/forms";
import get from "lodash/get";

import { EventBus, IEvent } from "@nova-ui/bits";

import { DynamicComponentCreator } from "../../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { IPizzagnaLayer, IProperties } from "../../../../../types";
import { PreviewService } from "../../../preview.service";
import { BaseConverter } from "../../base-converter";
import { TitleAndDescriptionConverterService } from "./title-and-description-converter.service";

describe("TitleAndDescriptionConverterService", () => {
    let service: TitleAndDescriptionConverterService;
    let preview: IPizzagnaLayer;
    let eventBus: EventBus<IEvent>;
    let pizzagnaService: PizzagnaService;
    let previewService: PreviewService;
    let form: FormGroup;
    let dynamicComponentCreator: DynamicComponentCreator;

    beforeEach(() => {
        eventBus = new EventBus();
        previewService = new PreviewService();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(
            eventBus,
            dynamicComponentCreator
        );
        service = new TitleAndDescriptionConverterService(
            eventBus,
            previewService,
            pizzagnaService
        );
        const formBuilder = new FormBuilder();
        form = formBuilder.group({
            title: "",
            subtitle: "",
            description: "",
            url: "",
        });
        preview = {
            header: {
                // @ts-ignore: Suppressed for test purposes
                properties: null,
            },
        };

        service.updatePreview(preview);
        service.updateFormPizzagna({});
    });

    it("should create", () => {
        expect(service).toBeTruthy();
    });

    describe("buildForm > ", () => {
        it("should update the form pizzagna based on the preview", () => {
            const testValue: IProperties = {
                title: "testTitle",
                subtitle: "testSubtitle",
                description: "testDesc",
                url: "testUrl",
                collapsible: false,
            };
            preview.header.properties = testValue;
            service.buildForm();
            expect(
                get(
                    pizzagnaService.pizzagna,
                    TitleAndDescriptionConverterService.PROPERTIES_PATH
                )
            ).toEqual(testValue);
        });
    });

    describe("toPreview > ", () => {
        it("should subscribe to form value changes and update the preview accordingly", () => {
            const oldValue: IProperties = {
                title: "oldTitle",
                subtitle: "oldSubtitle",
                description: "oldDesc",
                url: "oldUrl",
            };
            const newValue: IProperties = {
                title: "newTitle",
                subtitle: "newSubtitle",
                description: "newDesc",
                url: "newUrl",
            };
            preview.header.properties = oldValue;
            service.buildForm();

            service.toPreview(form);
            form.setValue(newValue);
            expect(service.getPreview().header.properties).toEqual(newValue);
        });
    });

    describe("ngAfterViewInit", () => {
        it("should call super ngAfterViewInit", () => {
            const spy = spyOn(BaseConverter.prototype, "ngAfterViewInit");
            service.ngAfterViewInit();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("ngOnDestroy", () => {
        it("should unsubscribe from form value changes", () => {
            const oldValue: IProperties = {
                title: "oldTitle",
                subtitle: "oldSubtitle",
                description: "oldDesc",
            };
            const newValue: IProperties = {
                title: "newTitle",
                subtitle: "newSubtitle",
                description: "newDesc",
                url: "newUrl",
            };
            preview.header.properties = oldValue;
            service.buildForm();

            service.toPreview(form);
            service.ngOnDestroy();
            form.setValue(newValue);
            expect(service.getPreview().header.properties).toEqual(oldValue);
        });
    });
});
