import { Injectable, OnDestroy } from "@angular/core";
import { LoggerService, uuid } from "@solarwinds/nova-bits";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { IFormatterDefinition, ITableFormatterDefinition } from "../components/types";

import { IAddFormattersOptions } from "./types";

type IFormattersRegistryMap<T extends IFormatterDefinition> = Record<string, T>;


export abstract class FormatterRegistryService<TFormatter extends IFormatterDefinition = IFormatterDefinition> implements OnDestroy {
    protected formattersState$: BehaviorSubject<IFormattersRegistryMap<TFormatter>> =
        new BehaviorSubject<IFormattersRegistryMap<TFormatter>>({});

    public formattersStateChanged$: Observable<TFormatter[]> = this.formattersState$.asObservable().pipe(
        map(() => this.getFormatters())
    );

    private _stateVersion: string;
    /* Helper method for non-reactive usages */
    public get stateVersion(): string {
        return this._stateVersion;
    }

    private _isEmpty: boolean = true;
    public get isEmpty(): boolean {
        return this._isEmpty;
    }

    protected constructor(private logger: LoggerService) {
    }

    public addFormatters(
        formatters: TFormatter[],
        options: IAddFormattersOptions = { overrideExisting: true }): void {
        const formattersStorageValue: IFormattersRegistryMap<TFormatter> = this.formattersState$.getValue();

        formatters.forEach((formatter: TFormatter) => {
            if (formattersStorageValue[formatter.componentType] && !options.overrideExisting) {

                this.logger.warn(`Formatter with componentType ${ formatter.componentType } and label ${ formatter.label }
                    is already registered. Skipping.`);

                return;
            }

            formattersStorageValue[formatter.componentType] = { ...formatter };
        });

        this.formattersState$.next(formattersStorageValue);

        if (formatters.length > 0) {
            this.updateStateFlags(false);
        }
    }

    public getFormatters(): TFormatter[] {
        return Object.values(this.formattersState$.getValue());
    }

    public reset(): void {
        this.formattersState$.next({});
        this.updateStateFlags(true);
    }

    public ngOnDestroy(): void {
        this.formattersState$.complete();
    }

    private updateStateFlags(isEmpty: boolean): void {
        this._isEmpty = isEmpty;
        this._stateVersion = uuid();
    }
}


@Injectable({ providedIn: "root" })
export class TableFormatterRegistryService extends FormatterRegistryService<ITableFormatterDefinition> {
    constructor(logger: LoggerService) {
        super(logger);
    }
}

@Injectable({ providedIn: "root" })
export class KpiFormattersRegistryService extends FormatterRegistryService<ITableFormatterDefinition> {
    constructor(logger: LoggerService) {
        super(logger);
    }
}
