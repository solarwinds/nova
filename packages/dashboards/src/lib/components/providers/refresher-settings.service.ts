import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { DEFAULT_REFRESH_INTERVAL } from "./types";

/**
 * This provider allows a system wide definition of widget refresh rates.
 */
@Injectable({
    providedIn: "root",
})
export class RefresherSettingsService {

    private _refreshRateSeconds: number = DEFAULT_REFRESH_INTERVAL;
    public refreshRateSeconds$ = new BehaviorSubject(this.refreshRateSeconds);

    /**
     * This is a system wide definition of refresh rate. Widgets have to be configured to use
     * the system settings to leverage this value.
     */
    public get refreshRateSeconds() {
        return this._refreshRateSeconds;
    }

    public set refreshRateSeconds(value: number) {
        this._refreshRateSeconds = value;
        this.refreshRateSeconds$.next(this._refreshRateSeconds);
    }

}
