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
