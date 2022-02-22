import { IFormatterDefinition } from "../../components/types";
import { IconFormatterComponent } from "../../configurator/components/formatters/icon-formatter/icon-formatter.component";
import { LinkFormatterComponent } from "../../configurator/components/formatters/link-formatter/link-formatter.component";
import { RawFormatterComponent } from "../../configurator/components/formatters/raw-formatter/raw-formatter.component";

export const DEFAULT_TABLE_FORMATTERS: IFormatterDefinition[] = [
  {
      componentType: RawFormatterComponent.lateLoadKey,
      label: $localize`No Formatter`,
      dataTypes: {
          // @ts-ignore
          value: null,
      },
  },
  {
      componentType: LinkFormatterComponent.lateLoadKey,
      label: $localize`Link`,
      configurationComponent: "LinkConfiguratorComponent",
      dataTypes: {
          value: "label",
          link: "link",
      },
  },
  {
      componentType: IconFormatterComponent.lateLoadKey,
      label: $localize`Icon`,
      dataTypes: {
          value: "string",
      },
  },
];
