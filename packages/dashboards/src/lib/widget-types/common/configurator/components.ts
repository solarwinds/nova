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

// eslint-disable-next-line max-len
import { RefresherConfigurationComponent } from "../../../configurator/components/widgets/configurator-items/refresher-configuration/refresher-configuration.component";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NOVA_GENERIC_CONVERTER,
} from "../../../services/types";
import { IComponentConfiguration, WellKnownProviders } from "../../../types";

/**
 * Component configuration for the refresher configurator node
 */
export const REFRESHER_CONFIGURATOR: IComponentConfiguration = {
    id: "refresher",
    componentType: RefresherConfigurationComponent.lateLoadKey,
    providers: {
        [WellKnownProviders.Converter]: {
            providerId: NOVA_GENERIC_CONVERTER,
            properties: {
                formParts: [
                    {
                        previewPath: `${DEFAULT_PIZZAGNA_ROOT}.providers.refresher.properties`,
                        keys: [
                            "enabled",
                            "interval",
                            "overrideDefaultSettings",
                        ],
                    },
                ],
            },
        },
    },
    properties: {
        overrideDefaultSettings: false,
    },
};
