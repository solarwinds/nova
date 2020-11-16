import { IProperties } from "../../types";

export interface IListWidgetConfiguration {
    componentType: string;
    itemConfigurationMap?: {
        [key: string]: any,
    };
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
}

