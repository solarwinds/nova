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

import { Directive, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { LoggerService, uuid } from "@nova-ui/bits";

import { IRegistryAddOptions } from "./types";

type IRegistryMap<T> = Record<string, T>;

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class RegistryService<T = Object> implements OnDestroy {
    protected state$: BehaviorSubject<IRegistryMap<T>> = new BehaviorSubject<
        IRegistryMap<T>
    >({});

    public stateChanged$: Observable<T[]> = this.state$
        .asObservable()
        .pipe(map(() => this.getItems()));

    private _stateVersion: string;
    /* Helper method for non-reactive usages */
    public get stateVersion(): string {
        return this._stateVersion;
    }

    private _isEmpty: boolean = true;
    public get isEmpty(): boolean {
        return this._isEmpty;
    }

    protected constructor(
        private logger: LoggerService,
        private className?: string
    ) {}

    public addItems(
        items: T[],
        options: IRegistryAddOptions = { overrideExisting: true }
    ): void {
        const storageValue: IRegistryMap<T> = this.state$.value;

        items.forEach((item: T) => {
            if (
                storageValue[this.getItemKey(item)] &&
                !options.overrideExisting
            ) {
                this.logger.warn(`Logger - ${
                    this.className
                }: item with ${this.getItemKey(item)}
                    is already registered. Skipping.`);

                return;
            }

            storageValue[this.getItemKey(item)] = { ...item };
        });

        this.state$.next(storageValue);

        if (items.length > 0) {
            this.updateStateFlags(false);
        }
    }

    public getItem(id: string): T | undefined {
        return this.state$.value[id];
    }

    public getItems(): T[] {
        return Object.values(this.state$.value);
    }

    public reset(): void {
        this.state$.next({});
        this.updateStateFlags(true);
    }

    public ngOnDestroy(): void {
        this.state$.complete();
    }

    protected abstract getItemKey(item: T): string;

    private updateStateFlags(isEmpty: boolean): void {
        this._isEmpty = isEmpty;
        this._stateVersion = uuid();
    }
}
