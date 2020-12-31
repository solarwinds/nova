import { EventDefinition, IEvent } from "@nova-ui/bits";
import { BehaviorSubject } from "rxjs";

export const DATA_SOURCE_OUTPUT = new EventDefinition("DATA_SOURCE_OUTPUT");
export const DATA_SOURCE_DESTROYED = new EventDefinition("DATA_SOURCE_DESTROYED");
export const DATA_SOURCE_CHANGE = new EventDefinition("DATA_SOURCE_CHANGE");
export const DATA_SOURCE_CREATED = new EventDefinition("DATA_SOURCE_CREATED", () => new BehaviorSubject<IEvent>({payload: undefined}));
