import {
    Injectable,
    Optional,
} from "@angular/core";
import noop from "lodash/noop";

import {
    LogLevel,
    NuiEnvironment,
} from "../environment";

/**
 * __Name : __
 * Log Service
 *
 * __Usage :__
 * Used to show log messages in the console
 */
/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class LoggerService {
    private logLevel: LogLevel = LogLevel.warn;

    constructor(@Optional() env?: NuiEnvironment) {
        if (env && env.logLevel) {
            this.logLevel = env.logLevel;
            this.info("Log level set to " + this.logLevel);
        }
    }

    /**
     *
     * __Description:__ Log to debug
     * @param ...msgs multiple arguments to be logged.
     */
    get debug(): Function {
        if (this.logLevel === LogLevel.debug) {
            // eslint-disable-next-line no-console
            return console.debug.bind(console);
        }
        return noop;
    }

    /**
     *
     * __Description:__ Log to info
     * @param ...msgs multiple arguments to be logged.
     */
    get info(): Function {
        if (this.logLevel === LogLevel.debug ||
            this.logLevel === LogLevel.info) {
            // eslint-disable-next-line no-console
            return console.info.bind(console);
        }
        return noop;
    }

    /**
     *
     * __Description:__ Log without specifying log level
     * @param ...msgs multiple arguments to be logged.
     */
    get log(): Function {
        if (this.logLevel === LogLevel.debug ||
            this.logLevel === LogLevel.info ||
            this.logLevel === LogLevel.log) {
            return console.log.bind(console);
        }
        return noop;
    }

    /**
     *
     * __Description:__ Log to warn
     * @param ...msgs multiple arguments to be logged.
     */
    get warn(): Function {
        if (this.logLevel === LogLevel.debug ||
            this.logLevel === LogLevel.info ||
            this.logLevel === LogLevel.log ||
            this.logLevel === LogLevel.warn) {
            return console.warn.bind(console);
        }
        return noop;
    }

    /**
     *
     * __Description:__ Log to error
     * @param ...msgs multiple arguments to be logged.
     */
    get error(): Function {
        if (this.logLevel === LogLevel.debug ||
            this.logLevel === LogLevel.info ||
            this.logLevel === LogLevel.log ||
            this.logLevel === LogLevel.warn ||
            this.logLevel === LogLevel.error) {
            return console.error.bind(console);
        }
        return noop;
    }
}
