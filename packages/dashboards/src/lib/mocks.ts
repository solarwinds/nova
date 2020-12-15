import { ChangeDetectorRef } from "@angular/core";
import { LoggerService } from "@nova-ui/bits";

export const mockLoggerService = {
    info: () => { },
    debug: () => { },
    warn: () => { },
    error: () => { },
} as LoggerService;

export const mockChangeDetector = {
    markForCheck: () => { },
    detectChanges: () => { },
} as ChangeDetectorRef;
