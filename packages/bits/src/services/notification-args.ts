export enum SwitchState {
    on,
    off,
}

export interface IHighlightArgs {
    highlightState: SwitchState;
    status: string;
    items: any[];
    itemType: string;
    itemIdentificator: any;
}

export enum Channel {
    highlight = "highlight",
}
