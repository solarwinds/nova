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

import { EventBus, IEvent } from "@nova-ui/bits";

import { DynamicComponentCreator } from "../../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { IPizzagnaLayer, PizzagnaLayer } from "../../../../../types";
import { PreviewService } from "../../../preview.service";
import { GenericConverterService } from "./generic-converter.service";

const testKey = "providerId";
const testProviderId = "TestProviderId";
const mockFormParts = [
    {
        previewPath: "chart.providers.dataSource",
        keys: [testKey],
    },
];

describe("GenericConverterService > ", () => {
    let service: GenericConverterService;
    let eventBus: EventBus<IEvent>;
    let previewService: PreviewService;
    let pizzagnaService: PizzagnaService;
    let dynamicComponentCreator: DynamicComponentCreator;

    beforeEach(() => {
        eventBus = new EventBus();
        previewService = new PreviewService();
        previewService.preview = {};
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(
            eventBus,
            dynamicComponentCreator
        );
        service = new GenericConverterService(
            eventBus,
            previewService,
            pizzagnaService
        );
        service.updateConfiguration({
            formParts: mockFormParts,
        });
    });

    describe("buildForm > ", () => {
        it("should invoke updateFormPizzagna", () => {
            // setup
            const preview: IPizzagnaLayer = {
                chart: {
                    providers: {
                        dataSource: {
                            [testKey]: testProviderId,
                        },
                    },
                },
            };

            service.updatePreview(preview);
            service.updateFormPizzagna({});

            const spy = spyOn(service, "updateFormPizzagna");

            // action
            service.buildForm();

            // expectation
            const expectedPizzagnaUpdateValue = {
                [PizzagnaLayer.Data]: {
                    [service.componentId]: {
                        properties: {
                            [testKey]: testProviderId,
                        },
                    },
                },
            };

            expect(spy).toHaveBeenCalledWith(expectedPizzagnaUpdateValue);
        });

        it("should ignore invalid preview paths", () => {
            // setup
            service.updateConfiguration({
                formParts: [
                    {
                        previewPath: "unknownPath.unknownPath",
                        keys: [testKey],
                    },
                ],
            });

            const preview: IPizzagnaLayer = {
                [service.componentId]: {
                    providers: {
                        dataSource: {
                            [testKey]: testProviderId,
                        },
                    },
                },
            };

            service.updatePreview(preview);
            service.updateFormPizzagna({});

            const spy = spyOn(service, "updateFormPizzagna");

            // action
            service.buildForm();

            // expectation
            expect(spy).toHaveBeenCalledWith({});
        });

        it("should ignore irrelevant keys", () => {
            // setup
            service.updateConfiguration({
                formParts: [
                    {
                        previewPath: "chart.providers.dataSource",
                        keys: ["irrelevantKey"],
                    },
                ],
            });

            const preview: IPizzagnaLayer = {
                [service.componentId]: {
                    providers: {
                        dataSource: {
                            [testKey]: testProviderId,
                        },
                    },
                },
            };

            service.updatePreview(preview);
            service.updateFormPizzagna({});

            const spy = spyOn(service, "updateFormPizzagna");

            // action
            service.buildForm();

            // expectation
            expect(spy).toHaveBeenCalledWith({});
        });
    });
});
