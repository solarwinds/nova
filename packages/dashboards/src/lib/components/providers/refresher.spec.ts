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

import { NgZone } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { EventBus, IEvent } from "@nova-ui/bits";
import { RefresherSettingsService } from "@nova-ui/dashboards";

import { REFRESH } from "../../services/types";
import { Refresher } from "./refresher";
import { DEFAULT_REFRESH_INTERVAL } from "./types";

describe("Refresher > ", () => {
    let refresher: Refresher;
    let eventBus: EventBus<IEvent>;
    let ngZone: NgZone;
    let refresherSettings: RefresherSettingsService;

    beforeAll(() => {
        ngZone = TestBed.inject(NgZone);
        spyOn(ngZone, "runOutsideAngular").and.callFake((fn: Function) => fn());
    });

    beforeEach(() => {
        eventBus = new EventBus();
        refresherSettings = new RefresherSettingsService();
        refresher = new Refresher(eventBus, ngZone, refresherSettings);
    });

    describe("updateConfiguration > ", () => {
        it("should change the interval", fakeAsync(() => {
            refresher.updateConfiguration({ interval: 1, enabled: true });
            const spy = spyOn(eventBus.getStream(REFRESH), "next");
            tick(1);
            expect(spy).toHaveBeenCalledTimes(0);
            tick(999);
            expect(spy).toHaveBeenCalledTimes(1);
            refresher.updateConfiguration({ interval: 2, enabled: true });
            tick(1);
            expect(spy).toHaveBeenCalledTimes(1);
            tick(1999);
            expect(spy).toHaveBeenCalledTimes(2);
            refresher.ngOnDestroy();
        }));
    });

    describe("ngOnDestroy > ", () => {
        it("should clear the interval", fakeAsync(() => {
            refresher = new Refresher(eventBus, ngZone, refresherSettings);
            refresher.ngOnDestroy();
            const spy = spyOn(eventBus.getStream(REFRESH), "next");
            tick(DEFAULT_REFRESH_INTERVAL * 2);
            expect(spy).toHaveBeenCalledTimes(0);
        }));
    });

    describe("refresherSettings", () => {
        it("updates interval when global settings change", fakeAsync(() => {
            refresherSettings.refreshRateSeconds = 1;
            refresher.updateConfiguration({ overrideDefaultSettings: false });
            const spy = spyOn(eventBus.getStream(REFRESH), "next");
            tick(1);
            expect(spy).toHaveBeenCalledTimes(0);
            tick(999);
            expect(spy).toHaveBeenCalledTimes(1);
            refresherSettings.refreshRateSeconds = 2;
            tick(1);
            expect(spy).toHaveBeenCalledTimes(1);
            tick(1999);
            expect(spy).toHaveBeenCalledTimes(2);
            refresher.ngOnDestroy();
        }));
    });
});
