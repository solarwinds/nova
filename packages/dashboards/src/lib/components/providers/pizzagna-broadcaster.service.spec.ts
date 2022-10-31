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

import { ChangeDetectorRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";

import { EventBus, IEvent, LoggerService } from "@nova-ui/bits";

// eslint-disable-next-line max-len
import { TitleAndDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/title-and-description-configuration/title-and-description-configuration.component";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { SET_PROPERTY_VALUE } from "../../services/types";
import { PizzagnaBroadcasterService } from "./pizzagna-broadcaster.service";

const cdRefMock: ChangeDetectorRef = {
    markForCheck() {},
    detach() {},
    detectChanges() {},
    checkNoChanges() {},
    reattach() {},
};

describe("PizzagnaBroadcasterService > ", () => {
    let broadcaster: PizzagnaBroadcasterService;
    let eventBus: EventBus<IEvent>;
    let pizzagnaService: PizzagnaService;
    let dynamicComponentCreator: DynamicComponentCreator;
    let mockComponent: TitleAndDescriptionConfigurationComponent;

    beforeEach(() => {
        eventBus = new EventBus();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(
            eventBus,
            dynamicComponentCreator
        );
        broadcaster = new PizzagnaBroadcasterService(pizzagnaService);

        mockComponent = new TitleAndDescriptionConfigurationComponent(
            cdRefMock,
            new FormBuilder(),
            new LoggerService()
        );
    });

    it("should observe properties on 'component' level", () => {
        const testValue = "UPDATED VALUE";
        const testPath = "configuration.customPath";

        eventBus.getStream(SET_PROPERTY_VALUE).subscribe((v) => {
            expect(v.payload.value).toEqual(testValue);
            expect(v.payload.path).toEqual(testPath);
        });

        broadcaster["configs"] = [
            {
                trackOn: "component",
                key: "form.controls.title.valueChanges",
                paths: [testPath],
            },
        ];
        broadcaster.setComponent(mockComponent, "mockComponentId");

        mockComponent.form.controls.title.setValue(testValue);
    });

    it("should observe properties on 'pizzagna' level", () => {
        const testValue = "UPDATED VALUE 2";
        const testPath = "configuration.customPath";

        eventBus.getStream(SET_PROPERTY_VALUE).subscribe((v) => {
            expect(v.payload.value).toEqual(testValue);
            expect(v.payload.path).toEqual(testPath);
        });

        broadcaster["configs"] = [
            {
                trackOn: "pizzagna",
                key: "someComponent.properties.title",
                paths: [testPath],
            },
        ];
        broadcaster.setComponent(mockComponent, "mockComponentId");

        pizzagnaService.pizzaChanged.next({
            someComponent: {
                id: "someComponent",
                componentType: "someComponent",
                properties: {
                    title: testValue,
                },
            },
        });
    });
});
