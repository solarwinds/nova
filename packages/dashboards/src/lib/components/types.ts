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

import { IDataField, TableAlignmentOptions } from "@nova-ui/bits";

import { IFormatterData } from "../configurator/components/formatters/types";
import { IProperties } from "../types";
export interface IFormatterProperties extends IProperties {
    dataFieldIds?: IFormatterData;
}

export interface IFormatter {
    componentType: string;
    properties: IFormatterProperties;
}

export interface IFormatterConfigurator {
    formatter?: IFormatter;
    formatterDefinition: IFormatterDefinition;
    dataFields: IDataField[];
}

export interface IFormatterDefinitionProperties {
    /** CSS class to be applied to the formatter host element */
    elementClass?: string;
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
    properties?: IFormatterDefinitionProperties;
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

export enum EmbeddedContentMode {
    URL,
    HTML,
}
