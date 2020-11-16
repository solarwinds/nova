import {ToolbarItemComponent} from "./toolbar-item.component";

export enum ToolbarItemType {
    secondary = "secondary",
    primary = "primary",
}

export interface IToolbarGroupContent {
    items: ToolbarItemComponent[];
    title?: string;
}

export interface IToolbarSelectionState {
    current: number;
    total: number;
}

export enum ToolbarItemDisplayStyle {
    action = "action",
    main = "main",
    destructive = "destructive",
}
