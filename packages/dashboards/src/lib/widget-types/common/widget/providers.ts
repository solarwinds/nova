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

import { IRefresherProperties } from "../../../components/providers/refresher";
import {
    NOVA_DASHBOARD_EVENT_PROXY,
    NOVA_DATASOURCE_INTERVAL_REFRESHER,
} from "../../../services/types";
import { IProviderConfiguration } from "../../../types";

/**
 * A provider configuration for the dashboard event proxy
 */
export const EVENT_PROXY: IProviderConfiguration = {
    providerId: NOVA_DASHBOARD_EVENT_PROXY,
} as IProviderConfiguration;

/**
 * Retrieves a provider configuration for the interval refresher
 *
 * @param enabled Specify whether the adapter should be active by default
 * @param interval Specify the interval (in seconds) at which the refresher should invoke the data source adapter
 *
 * @returns A provider configuration for the refresher
 */
export function refresher(
    enabled = false,
    interval = 0
): IProviderConfiguration {
    return {
        providerId: NOVA_DATASOURCE_INTERVAL_REFRESHER,
        properties: {
            enabled,
            interval,
        } as IRefresherProperties,
    } as IProviderConfiguration;
}
