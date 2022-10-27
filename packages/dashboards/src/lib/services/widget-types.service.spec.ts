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

import { IWidgetTypeDefinition } from "../components/widget/types";
import { WellKnownPathKey } from "../types";
import { WidgetTypesService } from "./widget-types.service";

describe("WidgetTypesService", () => {
    let service: WidgetTypesService;

    beforeEach(() => {
        service = new WidgetTypesService();
    });

    describe("registerWidgetType > ", () => {
        it("should be able to register a widget type", () => {
            const widgetType: IWidgetTypeDefinition = {
                configurator: {},
                widget: {},
            };
            service.registerWidgetType("type", 1, widgetType);

            expect(service.getWidgetType("type")).toBe(widgetType);
            expect(service.getWidgetType("type", 1)).toBe(widgetType);
        });

        it("should handle multiple versions", () => {
            const widgetType1: IWidgetTypeDefinition = {
                configurator: {},
                widget: {},
            };
            service.registerWidgetType("type", 1, widgetType1);

            const widgetType2: IWidgetTypeDefinition = {
                configurator: {},
                widget: {},
            };
            service.registerWidgetType("type", 2, widgetType2);

            expect(service.getWidgetType("type", 1)).toBe(widgetType1);

            expect(service.getWidgetType("type", 2)).toBe(widgetType2);
            expect(service.getWidgetType("type")).toBe(widgetType2);
        });

        it("should override previously defined type", () => {
            const widgetType1: IWidgetTypeDefinition = {
                configurator: {},
                widget: {},
            };
            service.registerWidgetType("type", 1, widgetType1);

            const widgetType2: IWidgetTypeDefinition = {
                configurator: {},
                widget: {},
            };
            // override already defined widget type
            service.registerWidgetType("type", 1, widgetType2);

            expect(service.getWidgetType("type")).toBe(widgetType2);
            expect(service.getWidgetType("type", 1)).toBe(widgetType2);
        });
    });

    describe("setNode > ", () => {
        it("should set the node value according to the defined path", () => {
            const providerIds = ["testId1", "testId2"];
            const testPaths = {
                configurator: {
                    [WellKnownPathKey.DataSourceProviders]:
                        "dataSource.properties.dataSourceProviders",
                },
            };
            const widgetType1: IWidgetTypeDefinition = {
                paths: testPaths,
                configurator: {
                    structure: {
                        dataSource: {
                            properties: {
                                dataSourceProviders: [],
                            },
                        },
                    },
                },
                widget: {},
            };
            service.registerWidgetType("type", 1, widgetType1);

            const widgetTemplate = service.getWidgetType("type");
            service.setNode(
                widgetTemplate,
                "configurator",
                WellKnownPathKey.DataSourceProviders,
                providerIds
            );
            expect(service.getWidgetType("type", 1)).toEqual({
                paths: testPaths,
                configurator: {
                    structure: {
                        dataSource: {
                            properties: {
                                dataSourceProviders: providerIds,
                            },
                        },
                    },
                },
                widget: {},
            });
        });
    });
});
