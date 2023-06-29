// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
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

export interface QueryToken {
    value: string;
    start: number;
    end: number;
    focused?: boolean;
}

export interface ElementPadding {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface BaseCoordinates {
    left: number;
    top: number;
}

export interface ColorsConf {
    notif: string;
    highlight: string;
}

export interface RenderConfigurator<T> {
    getNotifColor(token: T): string;

    getHighlightColor(token: T): string;

    enhanceTokens?(tokens: T[]): T[];
}

export interface HintEntry {
    displayValue: string;
    value: string;
    icon?: string;
}

export type HelpEntry = HelpEntryCategory | HintEntry;

export interface HelpEntryCategory {
    notice?: boolean;
    header?: string;
    items?: any[];
}

export interface Tokenizer<T extends QueryToken> {
    tokenizeText(text: string, baseIdx?: number): T[];
}
export interface CaretCoordinates {
    top: number;
    left: number;
    scrollTop: number;
}
