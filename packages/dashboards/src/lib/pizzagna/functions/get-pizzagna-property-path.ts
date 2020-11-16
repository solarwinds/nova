import { PizzagnaLayer } from "../../types";

export interface IPizzagnaProperty {
    pizzagnaKey?: string;
    componentId: string;
    providerKey?: string;
    propertyPath: string[];
}

export function getPizzagnaPropertyPath(definition: IPizzagnaProperty) {
    if (definition.providerKey) {
        return [
            definition.pizzagnaKey || PizzagnaLayer.Data,
            definition.componentId,
            "providers",
            definition.providerKey,
            "properties",
            ...definition.propertyPath,
        ].join(".");
    } else {
        return [
            definition.pizzagnaKey || PizzagnaLayer.Data,
            definition.componentId,
            "properties",
            ...definition.propertyPath,
        ].join(".");
    }
}
