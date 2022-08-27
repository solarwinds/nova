import { Injectable } from "@angular/core";

import {
    IActiveToast,
    IToastConfig,
    IToastDeclaration,
    IToastService,
} from "./public-api";

/**
 * @ignore
 */
@Injectable()
export abstract class ToastServiceBase implements IToastService {
    abstract setConfig(config: IToastConfig, itemIdentificator?: string): void;

    abstract error(toastDeclaration: IToastDeclaration): IActiveToast;

    abstract info(toastDeclaration: IToastDeclaration): IActiveToast;

    abstract success(toastDeclaration: IToastDeclaration): IActiveToast;

    abstract warning(toastDeclaration: IToastDeclaration): IActiveToast;

    abstract clear(toastId?: number): void;

    abstract remove(toastId: number): boolean;
}
