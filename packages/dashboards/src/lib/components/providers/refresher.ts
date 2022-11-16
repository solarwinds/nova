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

import { Inject, Injectable, NgZone, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, EventDefinition } from "@nova-ui/bits";

import { REFRESH } from "../../services/types";
import { IWidgetEvent } from "../../services/widget-to-dashboard-event-proxy.service";
import { IConfigurable, IProperties, PIZZAGNA_EVENT_BUS } from "../../types";
import { RefresherSettingsService } from "./refresher-settings.service";
import { DEFAULT_REFRESH_INTERVAL } from "./types";

export interface IRefresherProperties extends IProperties {
    // refresh interval in seconds
    interval?: number;
    enabled?: boolean;
    overrideDefaultSettings?: boolean;
    eventDef?: EventDefinition<any>;
}

/**
 * This provider emits the REFRESH event every X milliseconds
 */
@Injectable()
export class Refresher implements OnDestroy, IConfigurable {
    private intervalRef?: number;

    protected enabled = true;
    protected overrideDefaultSettings = true;
    protected interval = DEFAULT_REFRESH_INTERVAL;
    protected eventDef = REFRESH;

    public readonly destroy$ = new Subject<void>();

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IWidgetEvent>,
        protected ngZone: NgZone,
        protected refresherSettings: RefresherSettingsService
    ) {
        this.refresherSettings.refreshRateSeconds$
            .pipe(takeUntil(this.destroy$))
            .subscribe((systemRefreshRate) => {
                if (!this.overrideDefaultSettings) {
                    this.initializeInterval();
                }
            });
    }

    public updateConfiguration(properties: IRefresherProperties): void {
        this.interval = properties.interval ?? DEFAULT_REFRESH_INTERVAL;
        this.enabled = properties.enabled ?? true;
        this.overrideDefaultSettings =
            properties.overrideDefaultSettings ?? true;
        this.eventDef = properties.event ?? REFRESH;

        this.initializeInterval();
    }

    public ngOnDestroy(): void {
        this.clearInterval();
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeInterval() {
        this.clearInterval();

        if (
            typeof this.interval === "undefined" ||
            this.getInterval() <= 0 ||
            this.enabled === false
        ) {
            return;
        }

        this.ngZone.runOutsideAngular(() => {
            // running timeout outside of angular zone to prevent visual tests from timing out
            this.intervalRef = setInterval(() => {
                this.ngZone.run(() => {
                    // callback function should be executed in zone to preserve the angular change detection
                    this.performAction();
                });
            }, this.getInterval() * 1000) as any;
        });
    }

    protected performAction(): void {
        this.eventBus.getStream(this.eventDef).next({});
    }

    private getInterval() {
        return this.overrideDefaultSettings
            ? this.interval
            : this.refresherSettings.refreshRateSeconds;
    }

    private clearInterval() {
        if (typeof this.intervalRef !== "undefined") {
            clearInterval(this.intervalRef);
            this.intervalRef = undefined;
        }
    }
}
