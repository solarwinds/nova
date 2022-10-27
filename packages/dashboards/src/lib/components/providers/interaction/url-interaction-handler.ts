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

import { EventBus, IEvent, LoggerService } from "@nova-ui/bits";

import { PIZZAGNA_EVENT_BUS } from "../../../types";
import { UrlInteractionService } from "./../../../services/url-interaction.service";
import {
    IInteractionHandlerProperties,
    IInteractionPayload,
    InteractionHandler,
} from "./interaction-handler";

export interface IUrlInteractionHandlerProperties
    extends IInteractionHandlerProperties {
    url: string;
    newWindow?: boolean;
}

// Window is an interface, so it fails when used in constructor parameters for AoT
export class WindowObject extends Window {}

@Injectable()
export class UrlInteractionHandler extends InteractionHandler<
    IUrlInteractionHandlerProperties,
    any
> {
    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        @Inject("windowObject") private window: WindowObject,
        private logger: LoggerService,
        private urlInteractionService: UrlInteractionService
    ) {
        super(eventBus);
    }

    protected handleInteraction(interaction: IInteractionPayload<any>) {
        if (!this.properties?.url) {
            this.logger.warn("The target url has not been defined.");
            return;
        }
        const href = this.urlInteractionService.template(this.properties.url, {
            data: interaction.data,
        });

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
