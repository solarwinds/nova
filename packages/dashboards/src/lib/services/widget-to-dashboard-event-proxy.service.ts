import { Inject, Injectable, OnDestroy, Optional } from "@angular/core";
import { EventBus, IEvent, IEventDefinition } from "@nova-ui/bits";
import keyBy from "lodash/keyBy";
import uniq from "lodash/uniq";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { PizzagnaService } from "../pizzagna/services/pizzagna.service";
import { DASHBOARD_EVENT_BUS, IConfigurable, IProperties, PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../types";

import { EventRegistryService } from "./event-registry.service";
import { WidgetConfigurationService } from "./widget-configuration.service";

export interface IWidgetEvent extends IEvent {
    widgetId?: string;
}

/**
 * Configuration of WidgetToDashboardEventProxy
 */
export interface IWidgetToDashboardEventProxyConfiguration extends IProperties {
    /**
     * List of events that are transmitted from widget to dashboard
     */
    upstreams?: string[];
    /**
     * List of events that are transmitted from dashboard to widget
     */
    downstreams?: string[];
}

/**
 * This provider transmits events between the dashboard event bus and the widget event bus.
 * It needs to be configured with the events that need transmission each way.
 */
@Injectable()
export class WidgetToDashboardEventProxyService implements IConfigurable, OnDestroy {

    private upstreamSubscriptions: Record<string, Subscription> = {};
    private downstreamSubscriptions: Record<string, Subscription> = {};
    private destroy$ = new Subject();
    private component: { componentId: string };

    private upstreams?: string[];
    private downstreams?: string[];
    public providerKey: string;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) private pizzagnaBus: EventBus<IEvent>,
                @Optional() @Inject(DASHBOARD_EVENT_BUS) private dashboardBus: EventBus<IEvent>,
                @Optional() private widgetConfigurationService: WidgetConfigurationService,
                private eventRegistry: EventRegistryService,
                private pizzagnaService: PizzagnaService) {
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public setComponent(component: any) {
        this.component = component;
    }

    public updateConfiguration(properties: IWidgetToDashboardEventProxyConfiguration): void {
        this.providerKey = properties.providerKey;
        this.upstreams = properties.upstreams;
        this.downstreams = properties.downstreams;

        if (this.upstreams) {
            // upstream = widget -> dashboard
            this.registerUpstreamSubscriptions(...this.upstreams);
        }
        if (this.downstreams) {
            // downstream = dashboard -> widget
            this.registerDownstreamSubscriptions(...this.downstreams);
        }
    }

    public addUpstream(stream: IEventDefinition) {
        this.addStream(stream, "upstreams");
    }

    public addDownstream(stream: IEventDefinition) {
        this.addStream(stream, "downstreams");
    }

    private addStream(stream: IEventDefinition, streamKey: "upstreams" | "downstreams") {
        const streams = uniq((this[streamKey] || []).concat(stream.id));
        this[streamKey] = streams;

        if (!this.component) {
            return;
        }

        this.pizzagnaService.setProperty({
            componentId: this.component.componentId,
            pizzagnaKey: PizzagnaLayer.Data,
            providerKey: this.providerKey,
            propertyPath: [streamKey],
        }, streams);
    }

    private registerUpstreamSubscriptions(...upstreams: string[]) {
        if (!this.dashboardBus) {
            return;
        }

        this.registerSubscriptions(upstreams, this.upstreamSubscriptions, this.pizzagnaBus,
                                   (stream: IEventDefinition, event: IEvent) => {
                                       // add widgetId to all events passed to the dashboard
                                       const widgetId = this.widgetConfigurationService.getWidget().id;

                                       this.dashboardBus.getStream(stream).next(<any>Object.assign({}, event, { widgetId }));
                                   });
    }

    private registerDownstreamSubscriptions(...downstreams: string[]) {
        if (!this.dashboardBus) {
            return;
        }

        this.registerSubscriptions(downstreams, this.downstreamSubscriptions, this.dashboardBus,
                                   (stream: IEventDefinition, event: IWidgetEvent) => {
                                       // pass only events that have matching widgetId or a widgetId that is not defined
                                       const widgetId = this.widgetConfigurationService.getWidget().id;
                                       if (typeof event.widgetId === "undefined" || widgetId === event.widgetId) {
                                           this.pizzagnaBus.getStream(stream).next(event);
                                       }
                                   });
    }

    private registerSubscriptions(streams: string[] = [], subscriptions: Record<string, Subscription>, sourceBus: EventBus<IEvent>,
                                  handleEvent: (stream: IEventDefinition, event: IEvent) => void) {
        const streamsIndex: Record<string, string> | null = streams ? keyBy(streams, x => x) : null;

        // remove subscriptions that are not valid anymore
        for (const streamId of Object.keys(subscriptions)) {
            if (!streamsIndex || !streamsIndex[streamId]) {
                subscriptions[streamId].unsubscribe();
                delete subscriptions[streamId];
            }
        }

        // add subscriptions that were not registered before
        for (const streamId of Object.keys(streamsIndex ?? {}).filter(s => !subscriptions[s])) {
            const eventDefinition = this.eventRegistry.getEvent(streamId);
            subscriptions[streamId] = sourceBus.getStream(eventDefinition)
                .pipe(takeUntil(this.destroy$))
                .subscribe((event: IEvent) => {
                    handleEvent(eventDefinition, event);
                });
        }
    }
}
