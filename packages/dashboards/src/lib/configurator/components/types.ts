import { EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { IWidget } from "../../types";

export interface IWidgetTemplateSelector {
    widgetSelected: EventEmitter<IWidget>;
}

export interface IItemConfiguration {
    id: string;
    componentType?: string;
    headerSubject?: BehaviorSubject<string>;
    [key: string]: any;
}
