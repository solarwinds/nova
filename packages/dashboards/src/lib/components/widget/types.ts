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
    uniqueKey?: string;
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
