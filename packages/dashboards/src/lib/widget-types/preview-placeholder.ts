import { StackComponent } from "../components/layouts/stack/stack.component";
import { IWidgetTypeDefinition } from "../components/widget/types";
import { PreviewPlaceholderComponent } from "../configurator/components/preview-placeholder/preview-placeholder.component";
import { DEFAULT_PIZZAGNA_ROOT } from "../services/types";
import { PizzagnaLayer, WellKnownPathKey } from "../types";
import { WIDGET_BODY, WIDGET_HEADER } from "./common/widget/components";

export const previewPlaceholder: IWidgetTypeDefinition = {
    paths: {
        widget: {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        },
        configurator: {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        },
    },
    widget: {
        [PizzagnaLayer.Structure]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                id: DEFAULT_PIZZAGNA_ROOT,
                componentType: StackComponent.lateLoadKey,
                properties: {
                    nodes: ["header", "body"],
                },
            },
            header: WIDGET_HEADER,
            body: WIDGET_BODY,
            bodyContent: {
                id: "bodyContent",
                componentType: PreviewPlaceholderComponent.lateLoadKey,
            },
        },
        [PizzagnaLayer.Configuration]: {
            header: {
                properties: {
                    title: $localize`New Widget`,
                },
            },
        },
    },
};
