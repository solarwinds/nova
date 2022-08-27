import { BehaviorSubject, ReplaySubject } from "rxjs";

import { EventDefinition, IEvent } from "@nova-ui/bits";

export const DATA_SOURCE_OUTPUT = new EventDefinition(
    "DATA_SOURCE_OUTPUT",
    () => new ReplaySubject<IEvent>(1)
);
export const DATA_SOURCE_DESTROYED = new EventDefinition(
    "DATA_SOURCE_DESTROYED"
);
export const DATA_SOURCE_CHANGE = new EventDefinition("DATA_SOURCE_CHANGE");
export const DATA_SOURCE_CREATED = new EventDefinition(
    "DATA_SOURCE_CREATED",
    () => new BehaviorSubject<IEvent>({ payload: undefined })
);
