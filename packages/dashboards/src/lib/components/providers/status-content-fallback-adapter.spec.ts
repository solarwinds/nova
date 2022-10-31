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

import { DATA_SOURCE_OUTPUT } from "../../configurator/types";
import { IPizzagnaProperty } from "../../pizzagna/functions/get-pizzagna-property-path";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { PizzagnaLayer } from "../../types";
import { StatusContentFallbackAdapter } from "./status-content-fallback-adapter";
import { IDataSourceError, IDataSourceOutput } from "./types";

describe("StatusContentFallbackAdapter > ", () => {
    let adapter: StatusContentFallbackAdapter;
    let eventBus: EventBus<IEvent>;
    let pizzagnaService: PizzagnaService;
    let dynamicComponentCreator: DynamicComponentCreator;
    let firstSetPropArg: IPizzagnaProperty;

    beforeEach(() => {
        eventBus = new EventBus();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(
            eventBus,
            dynamicComponentCreator
        );
        adapter = new StatusContentFallbackAdapter(eventBus, pizzagnaService);
        (<any>adapter).componentId = "testId";

        firstSetPropArg = {
            componentId: (<any>adapter).componentId,
            propertyPath: ["fallbackKey"],
            pizzagnaKey: PizzagnaLayer.Data,
        };
    });

    describe("in response to a DATA_SOURCE_OUTPUT event", () => {
        it("should invoke PizzagnaService.setProperty with 'undefined' for the 'fallbackKey' if the 'error' property is undefined", () => {
            const event: IEvent<IDataSourceOutput<any>> = {
                payload: {
                    result: {},
                },
            };

            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(firstSetPropArg, undefined);
        });

        it("should invoke PizzagnaService.setProperty with 'undefined' for the 'fallbackKey' if the 'error.type' property is undefined", () => {
            const event: IEvent<IDataSourceOutput<any>> = {
                payload: {
                    result: {},
                    error: {} as IDataSourceError,
                },
            };

            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(firstSetPropArg, undefined);
        });

        it("should invoke PizzagnaService.setProperty with the error type specified for the 'fallbackKey'", () => {
            const expectedError = "404";
            const event: IEvent<IDataSourceOutput<any>> = {
                payload: {
                    result: {},
                    error: {
                        type: expectedError,
                    },
                },
            };

            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(firstSetPropArg, expectedError);
        });

        it("should invoke PizzagnaService.setProperty with a string error type if the error type is a number", () => {
            const expectedError = 404;
            const event: IEvent<IDataSourceOutput<any>> = {
                payload: {
                    result: {},
                    error: {
                        type: expectedError,
                    },
                },
            };

            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(
                firstSetPropArg,
                expectedError.toString()
            );
        });
    });
});
