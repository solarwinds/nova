import { RefresherConfigurationComponent } from "../../../configurator/components/widgets/configurator-items/refresher-configuration/refresher-configuration.component";
import { DEFAULT_PIZZAGNA_ROOT, NOVA_GENERIC_CONVERTER } from "../../../services/types";
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
                        keys: ["enabled", "interval", "overrideDefaultSettings"],
                    },
                ],
            },
        },
    },
    properties: {
        overrideDefaultSettings: false,
    },
};
