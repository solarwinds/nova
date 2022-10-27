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
