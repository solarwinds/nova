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

import { Inject, Injectable } from "@angular/core";
import isArray from "lodash/isArray";
import omit from "lodash/omit";
import { ReplaySubject } from "rxjs";

import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";

import { ISetPropertyPayload, SET_PROPERTY_VALUE } from "../../services/types";
import {
    IComponentConfiguration,
    IPizza,
    IPizzagna,
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
} from "../../types";
import {
    getPizzagnaPropertyPath,
    IPizzagnaProperty,
} from "../functions/get-pizzagna-property-path";
import { DynamicComponentCreator } from "./dynamic-component-creator.service";

/**
 * This service allows pizzagna sub-components to read data of other components and initiate changes of property values
 */
@Injectable()
export class PizzagnaService {
    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        private dynamicComponentCreator: DynamicComponentCreator
    ) {}

    public pizzagna: IPizzagna;
    public pizzaChanged = new ReplaySubject<IPizza>(1);
    private components: IPizza;

    public updatePizzagna(pizzagna: IPizzagna) {
        this.pizzagna = pizzagna;
    }

    public updateComponents(components: IPizza) {
        this.components = components;
        this.pizzaChanged.next(components);
    }

    public getComponent(refId: string): IComponentConfiguration {
        const component = this.components[refId] as IComponentConfiguration;
        if (!component) {
            throw new Error("Component '" + refId + "' is not defined!");
        }
        return component;
    }

    public setProperty(property: IPizzagnaProperty | string, value: any) {
        const path =
            typeof property === "string"
                ? property
                : getPizzagnaPropertyPath(property);
        this.eventBus
            .getStream(SET_PROPERTY_VALUE)
            .next({ payload: { path, value } as ISetPropertyPayload });
    }

    public createComponentsFromTemplateWithProperties(
        parentPath: string,
        components: any
    ) {
        const componentIds = components.map((c: any) => c.id);
        let updatedPizzagna: IPizzagna =
            this.dynamicComponentCreator.getPizzagnaUpdatedWithComponents(
                this.pizzagna,
                parentPath,
                componentIds
            );

        for (const component of components) {
            for (const childId of Object.keys(component.children)) {
                updatedPizzagna = immutableSet(
                    updatedPizzagna,
                    `${PizzagnaLayer.Data}.${childId}.properties`,
                    component.children[childId]
                );
            }
        }

        // this is here to update the pizzagna for other converters that need to access the value immediately
        this.updatePizzagna(updatedPizzagna);

        this.eventBus.getStream(SET_PROPERTY_VALUE).next({
            payload: {
                path: "",
                value: updatedPizzagna,
            } as ISetPropertyPayload,
        });
    }

    public createComponentsFromTemplate(
        parentPath: string,
        componentIds: string[]
    ) {
        const updatedPizzagna =
            this.dynamicComponentCreator.getPizzagnaUpdatedWithComponents(
                this.pizzagna,
                parentPath,
                componentIds
            );
        // this is here to update the pizzagna for other converters that need to access the value immediately
        this.updatePizzagna(updatedPizzagna);
        this.eventBus.getStream(SET_PROPERTY_VALUE).next({
            payload: {
                path: "",
                value: updatedPizzagna,
            } as ISetPropertyPayload,
        });
    }

    public removeComponents(ids: string | string[]) {
        if (isArray(ids)) {
            ids.forEach((id) => this.removeComponent(id));
        } else {
            this.removeComponent(ids);
        }
    }

    private removeComponent(id: string): void {
        const updatedPizzagna: IPizzagna = { ...this.pizzagna };

        const componentNodes =
            this.pizzagna[PizzagnaLayer.Structure][id].properties?.nodes;
        const componentsToRemove = [id, ...componentNodes];

        const layers = [
            PizzagnaLayer.Structure,
            PizzagnaLayer.Configuration,
            PizzagnaLayer.Data,
        ];
        for (const layer of layers) {
            if (!updatedPizzagna[layer]) {
                continue;
            }
            for (const component of componentsToRemove) {
                updatedPizzagna[layer] = omit(
                    updatedPizzagna[layer],
                    component
                );
            }
        }

        this.eventBus.getStream(SET_PROPERTY_VALUE).next({
            payload: {
                path: "",
                value: updatedPizzagna,
            } as ISetPropertyPayload,
        });
        this.updatePizzagna(updatedPizzagna);
    }
}
