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
import isArray from "lodash/isArray";
import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, filter, takeUntil, tap } from "rxjs/operators";

import { EventBus, IEvent } from "@nova-ui/bits";

import { IBroker, IBrokerUserConfig, IBrokerValue } from "./types";
import { IPizzagnaProperty } from "../../pizzagna/functions/get-pizzagna-property-path";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import {
    IConfigurable,
    IProperties,
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
} from "../../types";

@Injectable()
export class KpiScaleSyncBroker implements IConfigurable {
    protected properties: IProperties;
    protected componentId: string;

    private valuesObject: Record<string, Array<Partial<IBrokerValue>>>;
    private brokers: IBroker[] = [];
    private builder = new KpiScaleSyncBrokerBuilder(this.brokers);
    private destroySubscriptions$ = new Subject<void>();
    private tileNodes: string[];

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        private pizzagnaService: PizzagnaService
    ) {
        this.valuesObject = this.builder.valuesObject;
    }

    public updateConfiguration(properties: IProperties): void {
        this.properties = properties;

        if (this.componentId) {
            this.createPropertiesAndSubscribeToBrokers();
        }
    }

    public configure(): KpiScaleSyncBrokerBuilder {
        return this.builder;
    }

    public getBrokers(): readonly IBroker[] {
        return this.brokers;
    }

    public subscribeToBrokers(): void {
        this.destroy();

        this.brokers.forEach((broker) => {
            broker.in$
                .pipe(
                    filter((_) => !!broker.in$.observers.length),
                    distinctUntilChanged(),
                    tap((data) => this.configureValueModel(data)),
                    tap((data) => this.processAndEmitSyncedValue(data, broker)),
                    takeUntil(this.destroySubscriptions$)
                )
                .subscribe();
        });
    }

    public setComponent(component: any, componentId: string): void {
        this.componentId = componentId;
        this.updateConfiguration(this.properties);
    }

    public destroy(): void {
        this.destroySubscriptions$.next();
        this.destroySubscriptions$.complete();
    }

    private processAndEmitSyncedValue(data: IBrokerValue, broker: IBroker) {
        let fn: Function = this.getMin;

        if (broker?.type) {
            fn = broker.type === "min" ? this.getMin : this.getMax;
        }

        const valuesToCompare: (number | undefined)[] = this.valuesObject[
            broker.id
        ]
            .filter((item) => item.targetID && item.targetValue)
            .map((item) => item.targetValue);

        broker.out$.next({
            ...data,
            targetValue: fn([...valuesToCompare]),
        });
    }

    private configureValueModel(data: IBrokerValue) {
        const targetObj = this.valuesObject[data.id].filter(
            (obj) => obj.targetID === data.targetID
        );

        targetObj.length
            ? (targetObj[0].targetValue = data.targetValue)
            : this.valuesObject[data.id].push({
                  targetID: data.targetID,
                  targetValue: data.targetValue,
              });
    }

    private createPropertiesAndSubscribeToBrokers() {
        this.tileNodes = this.pizzagnaService.getComponent(
            this.componentId
        ).properties?.nodes;
        const { scaleSyncConfig } = this.properties;

        if (this.tileNodes?.length) {
            this.tileNodes.forEach((node, i) => {
                const property: IPizzagnaProperty = {
                    componentId: node,
                    pizzagnaKey: PizzagnaLayer.Data,
                    propertyPath: [`syncValuesBroker`],
                };
                this.pizzagnaService.setProperty(property, this.getBrokers());
            });

            if (scaleSyncConfig && isArray(scaleSyncConfig)) {
                scaleSyncConfig.forEach((s: IBrokerUserConfig) =>
                    this.configure().addBroker({ id: s.id, type: s?.type })
                );
                this.subscribeToBrokers();
            }
        }
    }

    private getMin = (n: number[]) => Math.min(...n);
    private getMax = (n: number[]) => Math.max(...n);
}

class KpiScaleSyncBrokerBuilder {
    public readonly valuesObject: Record<string, Array<Partial<IBrokerValue>>> =
        {};

    constructor(private brokers: IBroker[]) {}

    public addBroker(broker: IBrokerUserConfig): KpiScaleSyncBrokerBuilder {
        const newBrokerSetting: IBrokerValue = {
            id: broker.id,
            targetID: "",
            targetValue: 1,
        };
        this.valuesObject[broker.id] = new Array<Partial<IBrokerValue>>();
        this.brokers.push({
            ...broker,
            ...this.getDefaultBrokerObject(newBrokerSetting, newBrokerSetting),
        });
        return this;
    }

    private getDefaultBrokerObject(input: IBrokerValue, output: IBrokerValue) {
        return {
            in$: new BehaviorSubject<IBrokerValue>(input),
            out$: new BehaviorSubject<IBrokerValue>(output),
        };
    }
}
