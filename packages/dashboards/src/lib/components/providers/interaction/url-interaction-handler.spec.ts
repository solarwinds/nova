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

import { EventBus, IEvent } from "@nova-ui/bits";
import { UrlInteractionService } from "@nova-ui/dashboards";

import { mockLoggerService } from "../../../mocks";
import { INTERACTION } from "../../../services/types";
import { IInteractionPayload } from "./interaction-handler";
import { UrlInteractionHandler } from "./url-interaction-handler";

import Spy = jasmine.Spy;

describe("UrlInteractionHandler", () => {
    describe("interactionType", () => {
        let payload: IInteractionPayload<string>;
        let handleInteractionSpy: Spy;
        let handler: UrlInteractionHandler;
        let eventBus: EventBus<IEvent>;
        let window: any;

        beforeEach(() => {
            window = {
                location: {
                    href: "default",
                },
                open: () => {},
            };
            eventBus = new EventBus<IEvent>();
            const urlInteraction = new UrlInteractionService(mockLoggerService);
            handler = new UrlInteractionHandler(
                eventBus,
                window,
                mockLoggerService,
                urlInteraction
            );
            handleInteractionSpy = spyOn(
                handler as any,
                "handleInteraction"
            ).and.callThrough();

            payload = { interactionType: "click", data: "data" };
        });

        it("handles interaction when interaction type matches", () => {
            handler.updateConfiguration({
                interactionType: "click",
                url: "url",
            });
            eventBus.getStream(INTERACTION).next({ payload });

            expect(handleInteractionSpy).toHaveBeenCalledWith(payload);
        });

        it("handles interaction when interaction type is not defined", () => {
            handler.updateConfiguration({ url: "url" });
            eventBus.getStream(INTERACTION).next({ payload });

            expect(handleInteractionSpy).toHaveBeenCalledWith(payload);
        });

        it("doesn't handle interaction when interaction type doesn't match", () => {
            handler.updateConfiguration({
                interactionType: "mismatch",
                url: "url",
            });
            eventBus.getStream(INTERACTION).next({ payload });

            expect(handleInteractionSpy).not.toHaveBeenCalled();
        });

        it("does redirect when url is not empty", () => {
            handler.updateConfiguration({ url: "${data}" });
            expect(window.location.href).toEqual("default");

            eventBus.getStream(INTERACTION).next({ payload });
            expect(handleInteractionSpy).toHaveBeenCalled();

            expect(window.location.href).toEqual(payload.data);
        });

        it("doesn't redirect when url is empty", () => {
            handler.updateConfiguration({ url: "" });
            expect(window.location.href).toEqual("default");

            eventBus.getStream(INTERACTION).next({ payload });
            expect(handleInteractionSpy).toHaveBeenCalled();

            expect(window.location.href).toEqual("default");
        });

        it("should not throw error if properties are undefined", () => {
            (<any>handler).properties = undefined;

            expect(() =>
                eventBus.getStream(INTERACTION).next({ payload })
            ).not.toThrow();
        });
    });
});
