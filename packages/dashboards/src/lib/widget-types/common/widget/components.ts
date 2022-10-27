// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { WidgetErrorComponent } from "../../../common/components/widget-error/widget-error.component";
import { LoadingComponent } from "../../../components/loading/loading.component";
import { IWidgetErrorDisplayProperties } from "../../../components/widget/types";
import { WidgetBodyContentComponent } from "../../../components/widget/widget-body-content/widget-body-content.component";
import { WidgetBodyComponent } from "../../../components/widget/widget-body/widget-body.component";
import { WidgetHeaderComponent } from "../../../components/widget/widget-header/widget-header.component";
import {
    NOVA_LOADING_ADAPTER,
    NOVA_STATUS_CONTENT_FALLBACK_ADAPTER,
} from "../../../services/types";
import {
    HttpStatusCode,
    IComponentConfiguration,
    IProviderConfiguration,
    WellKnownProviders,
} from "../../../types";
import { ErrorNodeKey } from "./types";

/**
 * Component definition for the widget header node
 */
export const WIDGET_HEADER: IComponentConfiguration = {
    id: "header",
    componentType: WidgetHeaderComponent.lateLoadKey,
    properties: {
        editMode: false,
    },
};

/**
 * Component definition for the loading node
 */
export const WIDGET_LOADING: IComponentConfiguration = {
    id: "loading",
    componentType: LoadingComponent.lateLoadKey,
    providers: {
        [WellKnownProviders.LoadingAdapter]: {
            providerId: NOVA_LOADING_ADAPTER,
        },
    },
};

/**
 * Component configuration definition for the basic widget body node
 */
export const WIDGET_BODY: IComponentConfiguration = {
    id: "body",
    componentType: WidgetBodyComponent.lateLoadKey,
    properties: {
        // this value references the 'bodyContent' component in this structure
        content: "bodyContent",
    },
};

/**
 * A map of error codes to widget error node keys
 * --
 * An error code doesn't have to be an HTTP status code; it may be any string that matches an expected
 * data source error type. Additionally, the node keys may be any string as long as they correspond to an
 * error configuration node defined in the widget structure.
 */
export const ERROR_FALLBACK_MAP: Record<string, ErrorNodeKey> = {
    [HttpStatusCode.Unknown]: ErrorNodeKey.ErrorUnknown,
    [HttpStatusCode.Forbidden]: ErrorNodeKey.ErrorForbidden,
    [HttpStatusCode.NotFound]: ErrorNodeKey.ErrorNotFound,
};

/**
 * An index of common error configurations
 */
export const ERROR_NODES: Record<string, IComponentConfiguration> = {
    [ErrorNodeKey.ErrorUnknown]: {
        id: ErrorNodeKey.ErrorUnknown,
        componentType: WidgetErrorComponent.lateLoadKey,
        properties: {
            image: "no-data-to-show",
            title: $localize`Whoops, something went wrong`,
            description: $localize`There was an unexpected error.`,
        } as IWidgetErrorDisplayProperties,
    },
    [ErrorNodeKey.ErrorForbidden]: {
        id: ErrorNodeKey.ErrorForbidden,
        componentType: WidgetErrorComponent.lateLoadKey,
        properties: {
            image: "no-data-to-show",
            title: $localize`403 - Forbidden`,
            description: $localize`The requested action was forbidden.`,
        } as IWidgetErrorDisplayProperties,
    },
    [ErrorNodeKey.ErrorNotFound]: {
        id: ErrorNodeKey.ErrorNotFound,
        componentType: WidgetErrorComponent.lateLoadKey,
        properties: {
            image: "no-data-to-show",
            title: $localize`404 - Not Found`,
            description: $localize`The requested resource could not be found.`,
        } as IWidgetErrorDisplayProperties,
    },
};

/**
 * Retrieves an index of the basic widget body content nodes including fallback nodes
 *
 * @param mainContentNodeKey The key corresponding to the main body content node
 * @param fallbackAdapterId The id for the adapter responsible for activating fallback content in case of an error
 * @param fallbackMap A map of node keys to fallback content definitions
 * @param fallbackNodes An index of fallback content definitions
 *
 * @returns An index of component configurations
 */
export function widgetBodyContentNodes(
    mainContentNodeKey: string,
    fallbackAdapterId = NOVA_STATUS_CONTENT_FALLBACK_ADAPTER,
    fallbackMap: Record<string, string> = ERROR_FALLBACK_MAP,
    fallbackNodes: Record<string, IComponentConfiguration> = ERROR_NODES
): Record<string, IComponentConfiguration> {
    return {
        bodyContent: {
            id: "bodyContent",
            componentType: WidgetBodyContentComponent.lateLoadKey,
            properties: {
                primaryContent: mainContentNodeKey,
                fallbackMap,
            },
            providers: {
                [WellKnownProviders.ContentFallbackAdapter]: {
                    providerId: fallbackAdapterId,
                } as IProviderConfiguration,
            },
        },
        ...fallbackNodes,
    };
}
