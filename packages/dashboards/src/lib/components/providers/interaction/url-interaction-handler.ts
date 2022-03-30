import { Inject, Injectable } from "@angular/core";
import { EventBus, IEvent, LoggerService } from "@nova-ui/bits";

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
        
        const href = this.template(this.properties.url, { "data": interaction.data })

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

    private template(url: string, data: any): string{
        const regex = new RegExp(/(\$\{[a-zA-Z0-9.]*\})/g)
        let propertyArray: string[] = [];
        
        let interpolations = url.match(regex) || [];
        if (interpolations.length === 0) {
            return url;
        }

        interpolations.forEach(element => {
            propertyArray.push(element.slice(2,-1))
        });

        let evaluatedUrl = url;
        for (let i = 0; i < propertyArray.length; i++) {
            const evaluation = this.evaluate(propertyArray[i].split('.'), data);
            evaluatedUrl = evaluatedUrl.replace(interpolations[i], evaluation)
        }

        return evaluatedUrl;
    }

    private evaluate(properties: string[], data: any): string {
        let result = data;

        properties.forEach(element => {
            result = result[element];
        });

        return result;
    }
}
