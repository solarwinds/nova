import { TableAlignmentOptions } from "@solarwinds/nova-bits";

import { IFormatterData } from "../configurator/components/formatters/types";
import { IProperties } from "../types";

import { IDataField } from "./table-widget/types";

export interface IFormatterProperties extends IProperties {
    dataFieldIds?: IFormatterData;
}

export interface IFormatter {
    componentType: string;
    properties: IFormatterProperties;
}

export enum LegendPlacement {
    None = "None",
    Right = "Right",
    Bottom = "Bottom",
}

export interface IFormatterConfigurator {
    formatter?: IFormatter;
    formatterDefinition: IFormatterDefinition;
    dataFields: IDataField[];
}

export interface IFormatterDefinition {
    componentType: string;
    label: string;
    /**
     * The formatter's compatible data types.
     */
    dataTypes: Record<string, string | string[]>;
    /**
     * Component used to configure values for formatter.
     */
    configurationComponent?: string;
}

export interface ITableFormatterDefinition extends IFormatterDefinition {
    alignment?: TableAlignmentOptions;
}

export interface IInfoMessage {
    componentType: string;
    properties: IInfoMessageProperties;
}

export interface IInfoMessageProperties {
    generalText: string;
    emphasizeText?: string;
    link?: ILinkDefinition;
    allowDismiss?: boolean;
}

export interface ILinkDefinition {
    href: string;
    target: string;
    text: string;
}

export enum EmbeddedContentMode { URL, HTML }
