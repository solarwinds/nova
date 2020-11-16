/** @ignore */
export interface IDropEvent {
    event: DragEvent;
    payload: any;
}
/** @ignore */
export interface IDragPayload {
    data: any;
    isExternal: boolean;
}
/** @ignore */
export interface IDropValidator {
    isValidDropTarget(payload: any, isExternal?: boolean): boolean;
}
/** @ignore */
export interface IDragState {
    isInProgress: boolean;
    payload?: any;
}

/**
 * @ignore
 * This approach fixes Safari issue "ReferenceError: Can't find variable: DragEvent" on dev mode
 * */
export type IDragEvent = DragEvent;
