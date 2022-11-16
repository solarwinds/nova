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

import { Subscription } from "rxjs";

import { EventBus, EventDefinition, IEvent } from "@nova-ui/bits";

import { IWidget } from "../components/widget/types";
import { PizzagnaService } from "../pizzagna/services/pizzagna.service";
import { EventRegistryService } from "./event-registry.service";
import { WidgetConfigurationService } from "./widget-configuration.service";
import { WidgetToDashboardEventProxyService } from "./widget-to-dashboard-event-proxy.service";

describe("WidgetToDashboardEventProxyService", () => {
    let service: WidgetToDashboardEventProxyService;
    let pizzagnaBus: EventBus<IEvent>;
    let dashboardBus: EventBus<IEvent>;
    let widgetConfigService: WidgetConfigurationService;
    let pizzagnaService: PizzagnaService;
    let eventRegistry: EventRegistryService;
    const UPSTREAM_TEST_EVENT_1 = new EventDefinition("UPSTREAM_TEST_1");
    const UPSTREAM_TEST_EVENT_2 = new EventDefinition("UPSTREAM_TEST_2");
    const DOWNSTREAM_TEST_EVENT_1 = new EventDefinition("DOWNSTREAM_TEST_1");
    const DOWNSTREAM_TEST_EVENT_2 = new EventDefinition("DOWNSTREAM_TEST_2");
    const testWidgetId = "testId";

    beforeEach(() => {
        pizzagnaBus = new EventBus<IEvent>();
        dashboardBus = new EventBus<IEvent>();
        widgetConfigService = new WidgetConfigurationService();
        // @ts-ignore: Suppressed for testing purposes
        pizzagnaService = new PizzagnaService(null, null);

        eventRegistry = new EventRegistryService();
        eventRegistry.registerEvent(UPSTREAM_TEST_EVENT_1);
        eventRegistry.registerEvent(UPSTREAM_TEST_EVENT_2);
        eventRegistry.registerEvent(DOWNSTREAM_TEST_EVENT_1);
        eventRegistry.registerEvent(DOWNSTREAM_TEST_EVENT_2);

        widgetConfigService.updateWidget({ id: testWidgetId } as IWidget);
        service = new WidgetToDashboardEventProxyService(
            pizzagnaBus,
            dashboardBus,
            widgetConfigService,
            eventRegistry,
            pizzagnaService
        );
    });

    describe("updateConfiguration > ", () => {
        it("should not register subscriptions if the dashboard bus is not defined", () => {
            service = new WidgetToDashboardEventProxyService(
                pizzagnaBus,
                // @ts-ignore: Suppressed for testing purposes
                undefined,
                widgetConfigService,
                eventRegistry,
                pizzagnaService
            );
            service.updateConfiguration({
                upstreams: [UPSTREAM_TEST_EVENT_1.id],
                downstreams: [DOWNSTREAM_TEST_EVENT_1.id],
            });
            expect((<any>service).upstreamSubscriptions).toEqual({});
            expect((<any>service).downstreamSubscriptions).toEqual({});
        });

        it("should register upstream and downstream subscriptions", () => {
            service.updateConfiguration({
                upstreams: [UPSTREAM_TEST_EVENT_1.id],
                downstreams: [DOWNSTREAM_TEST_EVENT_1.id],
            });
            const upstreamSpy = spyOn(
                dashboardBus.getStream(UPSTREAM_TEST_EVENT_1),
                "next"
            );
            pizzagnaBus.getStream(UPSTREAM_TEST_EVENT_1).next({});
            expect(upstreamSpy).toHaveBeenCalledWith({
                id: UPSTREAM_TEST_EVENT_1.id,
                widgetId: testWidgetId,
            });
            const downstreamSpy = spyOn(
                pizzagnaBus.getStream(DOWNSTREAM_TEST_EVENT_1),
                "next"
            );
            dashboardBus.getStream(DOWNSTREAM_TEST_EVENT_1).next({});
            expect(downstreamSpy).toHaveBeenCalledWith({
                id: DOWNSTREAM_TEST_EVENT_1.id,
            });
        });

        it("should remove subscriptions that are no longer valid", () => {
            const upstreams = [
                UPSTREAM_TEST_EVENT_1.id,
                UPSTREAM_TEST_EVENT_2.id,
            ];
            const downstreams = [
                DOWNSTREAM_TEST_EVENT_1.id,
                DOWNSTREAM_TEST_EVENT_2.id,
            ];
            service.updateConfiguration({ upstreams, downstreams });
            expect(
                (<any>service).upstreamSubscriptions[
                    UPSTREAM_TEST_EVENT_1.id
                ] instanceof Subscription
            ).toEqual(true);
            expect(
                (<any>service).upstreamSubscriptions[
                    UPSTREAM_TEST_EVENT_2.id
                ] instanceof Subscription
            ).toEqual(true);
            expect(
                (<any>service).downstreamSubscriptions[
                    DOWNSTREAM_TEST_EVENT_1.id
                ] instanceof Subscription
            ).toEqual(true);
            expect(
                (<any>service).downstreamSubscriptions[
                    DOWNSTREAM_TEST_EVENT_2.id
                ] instanceof Subscription
            ).toEqual(true);
            const upstreamUnsubscribeSpy = spyOn(
                (<any>service).upstreamSubscriptions[UPSTREAM_TEST_EVENT_2.id],
                "unsubscribe"
            );
            const downstreamUnsubscribeSpy = spyOn(
                (<any>service).downstreamSubscriptions[
                    DOWNSTREAM_TEST_EVENT_2.id
                ],
                "unsubscribe"
            );
            service.updateConfiguration({
                upstreams: [UPSTREAM_TEST_EVENT_1.id],
                downstreams: [DOWNSTREAM_TEST_EVENT_1.id],
            });
            expect(upstreamUnsubscribeSpy).toHaveBeenCalled();
            expect(downstreamUnsubscribeSpy).toHaveBeenCalled();
            expect(
                (<any>service).upstreamSubscriptions[UPSTREAM_TEST_EVENT_2.id]
            ).toBeUndefined();
            expect(
                (<any>service).downstreamSubscriptions[
                    DOWNSTREAM_TEST_EVENT_2.id
                ]
            ).toBeUndefined();
        });

        it("should add subscriptions that were not registered previously", () => {
            service.updateConfiguration({
                upstreams: [UPSTREAM_TEST_EVENT_1.id],
                downstreams: [DOWNSTREAM_TEST_EVENT_1.id],
            });

            // Add more streams to the existing set
            const upstreams = [
                UPSTREAM_TEST_EVENT_1.id,
                UPSTREAM_TEST_EVENT_2.id,
            ];
            const downstreams = [
                DOWNSTREAM_TEST_EVENT_1.id,
                DOWNSTREAM_TEST_EVENT_2.id,
            ];
            service.updateConfiguration({ upstreams, downstreams });

            const upstreamSpy = spyOn(
                dashboardBus.getStream(UPSTREAM_TEST_EVENT_2),
                "next"
            );
            pizzagnaBus.getStream(UPSTREAM_TEST_EVENT_2).next({});
            expect(upstreamSpy).toHaveBeenCalled();
            const downstreamSpy = spyOn(
                pizzagnaBus.getStream(DOWNSTREAM_TEST_EVENT_2),
                "next"
            );
            dashboardBus.getStream(DOWNSTREAM_TEST_EVENT_2).next({});
            expect(downstreamSpy).toHaveBeenCalled();
        });
    });

    describe("ngOnDestroy > ", () => {
        it("should unsubscribe all subscriptions", () => {
            service.updateConfiguration({
                upstreams: [UPSTREAM_TEST_EVENT_1.id],
                downstreams: [DOWNSTREAM_TEST_EVENT_1.id],
            });
            service.ngOnDestroy();

            const upstreamSpy = spyOn(
                dashboardBus.getStream(UPSTREAM_TEST_EVENT_1),
                "next"
            );
            pizzagnaBus.getStream(UPSTREAM_TEST_EVENT_1).next({});
            expect(upstreamSpy).not.toHaveBeenCalled();
            const downstreamSpy = spyOn(
                pizzagnaBus.getStream(DOWNSTREAM_TEST_EVENT_1),
                "next"
            );
            dashboardBus.getStream(DOWNSTREAM_TEST_EVENT_1).next({});
            expect(downstreamSpy).not.toHaveBeenCalled();
        });
    });
});
