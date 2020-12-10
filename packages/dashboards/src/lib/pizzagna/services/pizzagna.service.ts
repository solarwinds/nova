import { Inject, Injectable } from "@angular/core";
import { EventBus, IEvent } from "@nova-ui/bits";
import isArray from "lodash/isArray";
import omit from "lodash/omit";
import { ReplaySubject } from "rxjs";

import { ISetPropertyPayload, SET_PROPERTY_VALUE } from "../../services/types";
import { IComponentConfiguration, IPizza, IPizzagna, PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../types";
import { getPizzagnaPropertyPath, IPizzagnaProperty } from "../functions/get-pizzagna-property-path";

import { DynamicComponentCreator } from "./dynamic-component-creator.service";

/**
 * This service allows pizzagna sub-components to read data of other components and initiate changes of property values
 */
@Injectable()
export class PizzagnaService {

    constructor(@Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
                private dynamicComponentCreator: DynamicComponentCreator) {}

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
        const path = typeof property === "string" ?
            property : getPizzagnaPropertyPath(property);
        this.eventBus.getStream(SET_PROPERTY_VALUE)
            .next({ payload: { path, value } as ISetPropertyPayload });
    }

    public createComponentsFromTemplate(parentPath: string, componentIds: string[]) {
        const updatedPizzagna = this.dynamicComponentCreator.getPizzagnaUpdatedWithComponents(this.pizzagna, parentPath, componentIds);
        // this is here to update the pizzagna for other converters that need to access the value immediately
        this.updatePizzagna(updatedPizzagna);
        this.eventBus.getStream(SET_PROPERTY_VALUE)
            .next({ payload: { path: "", value: updatedPizzagna } as ISetPropertyPayload });
    }

    public removeComponents(ids: string | string[]) {
        if (isArray(ids)) {
            ids.forEach(id => this.removeComponent(id));
        } else {
            this.removeComponent(ids);
        }
    }

    private removeComponent(id: string): void {
        const updatedPizzagna: IPizzagna = { ...this.pizzagna };

        const componentNodes = this.pizzagna[PizzagnaLayer.Structure][id].properties?.nodes;
        const componentsToRemove = [id, ...componentNodes];

        const layers = [PizzagnaLayer.Structure, PizzagnaLayer.Configuration, PizzagnaLayer.Data];
        for (const layer of layers) {
            if (!updatedPizzagna[layer]) {
                continue;
            }
            for (const component of componentsToRemove) {
                updatedPizzagna[layer] = omit(updatedPizzagna[layer], component);
            }
        }

        this.eventBus.getStream(SET_PROPERTY_VALUE)
            .next({ payload: { path: "", value: updatedPizzagna } as ISetPropertyPayload });
        this.updatePizzagna(updatedPizzagna);
    }
}
