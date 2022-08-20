import { IPizzagna } from "../../types";

export interface IWidgets {
    [key: string]: IWidget;
}

export interface IWidget {
    id: string;
    type: string;
    version?: number;
    pizzagna: IPizzagna;
    metadata?: IWidgetMetadata;
}

export interface IWidgetMetadata extends Record<string, any> {
    /**
     * Set this to true to communicate to the widget cloner that the widget requires
     * further configuration before it can be placed on the dashboard.
     */
    needsConfiguration?: boolean;
}

export interface IWidgetTypeDefinition {
    configurator?: IPizzagna;
    widget: IPizzagna;
    /**
     * Paths to various important values in pizzagnas - this should be coupled with respective pizzagnas in v10 - NUI-5829
     */
    paths?: {
        widget?: Record<string, string>;
        configurator?: Record<string, string>;
    };
}

/**
 * The properties for widget error display
 */
export interface IWidgetErrorDisplayProperties {
    image: string;
    title: string;
    description: string;
}
