import { IProperties } from "../../types";
import { IFormatter } from "../types";

export interface IListWidgetConfiguration extends IFormatter {
    properties: Record<string, any>;
    itemProperties?: IProperties;
}

export interface INavigationBarButtons {
    back?: {
        disabled?: boolean;
    };
    home?: {
        disabled?: boolean;
    };
}

export interface INavigationBarConfig {
    buttons?: INavigationBarButtons;
    label?: string;
    isRoot?: boolean;
}

