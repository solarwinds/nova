import { Inject, Injectable } from "@angular/core";
import { EventBus, IEvent, LoggerService } from "@nova-ui/bits";
import template from "lodash/template";

import { PIZZAGNA_EVENT_BUS } from "../../../types";

import { IInteractionHandlerProperties, IInteractionPayload, InteractionHandler } from "./interaction-handler";

export interface IUrlInteractionHandlerProperties extends IInteractionHandlerProperties {
    url: string;
    newWindow?: boolean;
}

// Window is an interface, so it fails when used in constructor parameters for AoT
export class WindowObject extends Window {
}

@Injectable()
export class UrlInteractionHandler extends InteractionHandler<IUrlInteractionHandlerProperties, any> {

    private templateOptions = {
        evaluate: null as unknown as RegExp, // disable javascript evaluation in provided url
    };

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                @Inject("windowObject") private window: WindowObject,
                private logger: LoggerService) {
        super(eventBus);
    }

    protected handleInteraction(interaction: IInteractionPayload<any>) {
        if (!this.properties?.url) {
            this.logger.warn("The target url has not been defined.");
            return;
        }
        const href = template(this.properties.url, this.templateOptions)({ "data": interaction.data });

        // if the link evaluates as empty, then don't go anywhere
        if (!href) {
            return;
        }

        if (this.properties.newWindow) {
            this.window.open(href);
        } else {
            this.window.location.href = href;
        }
    }

}
