import { OnDestroy } from "@angular/core";
import get from "lodash/get";
import { Observable, Subscription } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";

import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { IConfigurable, IProperties } from "../../types";

import { BroadcasterTrackOnType, IBroadcasterConfig } from "./types";

export class PizzagnaBroadcasterService implements IConfigurable, OnDestroy {
    private component: any;
    private configs: IBroadcasterConfig[];
    private readonly defaultTrackOn: BroadcasterTrackOnType = "pizzagna";

    private subscriptions: Subscription[] = [];

    constructor(private pizzagnaService: PizzagnaService) {
    }

    public setComponent(component: any) {
        this.component = component;
        this.initChangeSubscriptions();
    }

    public updateConfiguration(properties: IProperties) {
        this.configs = properties?.configs;
    }

    private initChangeSubscriptions() {
        for (const config of this.configs) {
            const observable = this.getObservableFor(config);

            if (!observable) {
                console.warn("no observable found on 'PizzagnaBroadcasterService', for part: ", config);
                return;
            }

            const subscription = observable.subscribe((v) => {
                for (const path of config.paths) {
                    this.pizzagnaService.setProperty(path, v);
                }
            });
            this.subscriptions.push(subscription);
        }
    }

    private getObservableFor(config: IBroadcasterConfig) {
        const trackOn: BroadcasterTrackOnType = config.trackOn || this.defaultTrackOn;
        const observable: Observable<any> = trackOn === "component"
            ? this.getComponentObservableFor(config)
            : this.getPizzagnaObservableFor(config);
        return observable;
    }

    private getPizzagnaObservableFor(part: IBroadcasterConfig) {
        return this.pizzagnaService.pizzaChanged
            .pipe(
                map(v => get(v, part.key)),
                distinctUntilChanged()
            );
    }

    private getComponentObservableFor(part: IBroadcasterConfig) {
        const obs: Observable<any> = get(this.component, part.key);
        return obs?.pipe(distinctUntilChanged());
    }

    public ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
