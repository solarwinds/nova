import { Inject, Injectable } from "@angular/core";
import { EventBus, IEvent } from "@nova-ui/bits";

import { INTERACTION } from "../../../services/types";
import { IConfigurable, IProperties, PIZZAGNA_EVENT_BUS } from "../../../types";

export interface IInteractionPayload<T> {
    interactionType?: string;
    data: T;
}

export interface IInteractionHandlerProperties extends IProperties {
    interactionType?: string;
}

@Injectable()
export abstract class InteractionHandler<T extends IInteractionHandlerProperties, P> implements IConfigurable {

    protected properties: T;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) protected readonly eventBus: EventBus<IEvent>) {
        this.initializeSubscriptions();
    }

    public updateConfiguration(properties: T): void {
        this.properties = properties;
    }

    protected initializeSubscriptions() {
        this.eventBus.getStream(INTERACTION).subscribe((event: IEvent<IInteractionPayload<any>>) => {
            if (!this.properties.interactionType || this.properties.interactionType === event.payload?.interactionType) {
                // TODO: ensure that payload is defined
                // @ts-ignore
                this.handleInteraction(event.payload);
            }
        });
    }

    protected abstract handleInteraction(interaction: IInteractionPayload<P>): void;

}

