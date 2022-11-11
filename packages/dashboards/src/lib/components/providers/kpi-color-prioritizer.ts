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

import { Inject, Injectable, OnDestroy, Optional } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IDataSource } from "@nova-ui/bits";

import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { KpiColorComparatorsRegistryService } from "../../services/kpi-color-comparators-registry.service";
import { DATA_SOURCE, IComparatorsDict, IConfigurable } from "../../types";
import { IKpiData } from "../kpi-widget/types";
import { IDataSourceOutput, IKpiColorRules } from "./types";

@Injectable()
export class KpiColorPrioritizer implements IConfigurable, OnDestroy {
    protected destroy$ = new Subject<void>();
    protected componentId: string;
    protected propertyPath: string = "backgroundColor";
    protected rules: IKpiColorRules[] | undefined;
    protected comparators: IComparatorsDict;

    private dsSubscription$: Subscription;
    private latestValueFromDS: any;

    constructor(
        @Optional() @Inject(DATA_SOURCE) public dataSource: IDataSource,
        protected pizzagnaService: PizzagnaService,
        comparatorsRegistry: KpiColorComparatorsRegistryService
    ) {
        this.comparators = comparatorsRegistry.getComparators();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public updateConfiguration(properties: any) {
        if (properties?.rules) {
            this.rules = properties?.rules;
            this.subscribeToDataChanges();
            this.checkColorConditions();
        }
    }

    public setComponent(component: any, componentId: string) {
        this.subscribeToDataChanges();

        this.componentId = componentId;
    }

    private subscribeToDataChanges() {
        if (!this.dataSource) {
            return;
        }

        this.dsSubscription$?.unsubscribe();

        this.dsSubscription$ = this.dataSource.outputsSubject
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IDataSourceOutput<IKpiData>) => {
                this.latestValueFromDS =
                    event.result?.value || this.latestValueFromDS;
                this.checkColorConditions();
            });
    }

    private checkColorConditions() {
        if (!this.rules) {
            return;
        }

        if (this.rules.length === 0) {
            this.setColor(undefined);
            this.dsSubscription$?.unsubscribe();
            return;
        }

        let colorToSet: string | undefined;
        // reverse because last rule has top priority
        const newRules = this.rules && [...this.rules].reverse();
        for (const rule of newRules) {
            if (
                this.comparators[rule.comparisonType]?.comparatorFn(
                    this.latestValueFromDS,
                    rule.value
                )
            ) {
                colorToSet = rule.color;
                break; // exit if the rule matches
            }
        }

        this.setColor(colorToSet);
    }

    /**
     * Sets the color to pizzagna
     *
     * @param color - Color to set
     */
    private setColor(color: string | undefined) {
        this.pizzagnaService.setProperty(
            {
                componentId: this.componentId,
                propertyPath: [this.propertyPath],
            },
            color
        );
    }
}
