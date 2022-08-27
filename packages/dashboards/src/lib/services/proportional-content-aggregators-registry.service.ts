import { Injectable } from "@angular/core";

import { LoggerService } from "@nova-ui/bits";

import { IProportionalDonutContentAggregatorDefinition } from "../functions/proportional-aggregators/types";
import { RegistryService } from "./registry-service";

@Injectable({ providedIn: "root" })
export class ProportionalContentAggregatorsRegistryService extends RegistryService<IProportionalDonutContentAggregatorDefinition> {
    constructor(logger: LoggerService) {
        super(logger, "ProportionalContentAggregatorsRegistryService");
    }

    getItemKey(item: IProportionalDonutContentAggregatorDefinition) {
        return item.aggregatorType;
    }
}
