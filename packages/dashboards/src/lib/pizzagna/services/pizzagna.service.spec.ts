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

import { ISetPropertyPayload, SET_PROPERTY_VALUE } from "../../services/types";
import { IPizzagna, PizzagnaLayer } from "../../types";
import {
    getPizzagnaPropertyPath,
    IPizzagnaProperty,
} from "../functions/get-pizzagna-property-path";
import { DynamicComponentCreator } from "./dynamic-component-creator.service";
import { PizzagnaService } from "./pizzagna.service";

describe("PizzagnaService > ", () => {
    let service: PizzagnaService;
    let eventBus: EventBus<IEvent>;
    let dynamicComponentCreator: DynamicComponentCreator;

    beforeEach(() => {
        eventBus = new EventBus<IEvent>();
        dynamicComponentCreator = new DynamicComponentCreator();
        service = new PizzagnaService(eventBus, dynamicComponentCreator);
    });

    describe("setProperty > ", () => {
        it("should emit the SET_PROPERTY_VALUE event with a string path", () => {
            const testPayload: ISetPropertyPayload = {
                path: "test.string.path",
                value: "test value",
            };
            const spy = spyOn(eventBus.getStream(SET_PROPERTY_VALUE), "next");
            service.setProperty(testPayload.path, testPayload.value);
            expect(spy).toHaveBeenCalledWith({ payload: testPayload });
        });

        it("should emit the SET_PROPERTY_VALUE event with an IPizzagnaProperty path", () => {
            const pizzagnaProperty: IPizzagnaProperty = {
                pizzagnaKey: "testKey",
                componentId: "testComponentId",
                propertyPath: ["testPath"],
            };

            const expectedPayload: ISetPropertyPayload = {
                path: getPizzagnaPropertyPath(pizzagnaProperty),
                value: "test value",
            };
            const spy = spyOn(eventBus.getStream(SET_PROPERTY_VALUE), "next");
            service.setProperty(pizzagnaProperty, expectedPayload.value);
            expect(spy).toHaveBeenCalledWith({ payload: expectedPayload });
        });
    });

    describe("remove components", () => {
        it("preserves reference integrity of objects that were not removed", () => {
            const pizzagna: IPizzagna = {
                [PizzagnaLayer.Structure]: {
                    component1: {},
                    component2: {
                        properties: {
                            nodes: ["component2/first", "component2/second"],
                        },
                    },
                },
                [PizzagnaLayer.Data]: {
                    ["component2/first"]: {},
                },
                [PizzagnaLayer.Configuration]: {
                    ["component2/second"]: {},
                },
            };

            service.updatePizzagna(pizzagna);

            service.removeComponents(["component2"]);

            const expectedPizzagna = {
                [PizzagnaLayer.Structure]: {
                    component1: {},
                },
                [PizzagnaLayer.Data]: {},
                [PizzagnaLayer.Configuration]: {},
            };

            // deep comparison of object
            expect(service.pizzagna).toEqual(expectedPizzagna);

            // reference to component1 was not changed
            expect(service.pizzagna[PizzagnaLayer.Structure].component1).toBe(
                pizzagna[PizzagnaLayer.Structure].component1
            );
            // reference to 'structure' layer was modified as a component was removed from it
            expect(service.pizzagna[PizzagnaLayer.Structure]).not.toBe(
                pizzagna[PizzagnaLayer.Structure]
            );
        });
    });
});
