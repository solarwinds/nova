import { NgZone } from "@angular/core";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { EventBus, IEvent } from "@solarwinds/nova-bits";
import { RefresherSettingsService } from "@solarwinds/nova-dashboards";

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
