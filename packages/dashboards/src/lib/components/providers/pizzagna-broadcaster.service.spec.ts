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
