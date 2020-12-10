import { Injectable } from "@angular/core";
import { IEventDefinition } from "@nova-ui/bits";




@Injectable({
    providedIn: "root",
})
export class EventRegistryService {

    private events: Record<string, IEventDefinition> = {};

    public registerEvent(eventDefinition: IEventDefinition) {
        this.events[eventDefinition.id] = eventDefinition;
    }

    public getEvent(id: string) {
        const event = this.events[id];

        if (!event) {
            throw new Error("Event with id '" + id + "' is not registered. Registered events are: " + JSON.stringify(Object.keys(this.events)));
        }

        return event;
    }

}
