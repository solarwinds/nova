import { Injectable, Optional, SkipSelf } from "@angular/core";

export enum LogLevel {
    debug = "debug",
    info = "info",
    log = "log",
    warn = "warn",
    error = "error",
}

/**
 * @ignore
 * To modify nui env from outside please create a new instance of NuiEnvironment and
 * include it in a custom provider
 */
@Injectable()
export class NuiEnvironment {
    public logLevel: LogLevel = LogLevel.warn;
}

/** @ignore */
export function NUI_ENV_PROVIDER_FACTORY(parentEnv: NuiEnvironment) {
    return parentEnv || new NuiEnvironment();
}

/** @ignore */
export const NUI_ENV_PROVIDER = {
    // If there is already an MatPaginatorIntl available, use that. Otherwise, provide a new one.
    provide: NuiEnvironment,
    deps: [[new Optional(), new SkipSelf(), NuiEnvironment]],
    useFactory: NUI_ENV_PROVIDER_FACTORY,
};
