import { EventEmitter, ViewContainerRef } from "@angular/core";

export interface ICheckboxComponent {
    name: string;
    title: string;
    value: any;
    valueChange: EventEmitter<CheckboxChangeEvent>;
    hovered: boolean;
    checked: boolean;
    required: boolean;
    hint: string;
    disabled: boolean;
    indeterminate: boolean;
    inputViewContainer: ViewContainerRef;
    hoverHandler(): void;
    changeHandler(event: CheckboxChangeEvent): void;
}
/** @ignore */
export class CheckboxChangeEvent {
    public target: ICheckboxComponent;
}
