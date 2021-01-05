import { IFormatter } from "../components/types";
import { IFormatterData } from "../configurator/components/formatters/types";

/**
 *
 * Takes formatter "dataFieldIds" from "properties" and maps the data to the formatter input.
 * Might be used for nuiComponentPortal directive for formatter "properties"
 *
 * @param formatter
 * @param data
 */
export function mapDataToFormatterProperties<T extends { [key: string]: any }>(formatter: IFormatter, data: T): { data: IFormatterData } {
    const { dataFieldIds } = formatter.properties || {};

    let formatterProps;
    if (!dataFieldIds) {
        // assign just "value" if no dataFields provided
        formatterProps = { value: data.value };
    } else {
        formatterProps = Object.keys(dataFieldIds).reduce((dataFieldsAcc: any, formatterKey) => {
            const widgetDataKey: string = dataFieldIds[formatterKey];

            dataFieldsAcc[formatterKey] = data[widgetDataKey];
            return dataFieldsAcc;
        }, {});
    }

    return formatterProps;
}
