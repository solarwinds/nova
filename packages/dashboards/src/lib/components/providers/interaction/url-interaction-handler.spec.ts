import { EventBus, IEvent, LoggerService } from "@solarwinds/nova-bits";
import Spy = jasmine.Spy;
import noop from "lodash/noop";

import { INTERACTION } from "../../../services/types";

import { IInteractionPayload } from "./interaction-handler";
import { UrlInteractionHandler } from "./url-interaction-handler";

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
                open: () => {
                },
            };
            eventBus = new EventBus<IEvent>();
            const logger = new LoggerService();
            spyOnProperty(logger, "warn").and.returnValue(noop); // suppress warnings
            handler = new UrlInteractionHandler(eventBus, window, logger);
            handleInteractionSpy = spyOn(handler as any, "handleInteraction").and.callThrough();

            payload = { interactionType: "click", data: "data" };
        });

        it("handles interaction when interaction type matches", () => {
            handler.updateConfiguration({ interactionType: "click", url: "url" });
            eventBus.getStream(INTERACTION).next({ payload });

            expect(handleInteractionSpy).toHaveBeenCalledWith(payload);
        });

        it("handles interaction when interaction type is not defined", () => {
            handler.updateConfiguration({ url: "url" });
            eventBus.getStream(INTERACTION).next({ payload });

            expect(handleInteractionSpy).toHaveBeenCalledWith(payload);
        });

        it("doesn't handle interaction when interaction type doesn't match", () => {
            handler.updateConfiguration({ interactionType: "mismatch", url: "url" });
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

    });

});
