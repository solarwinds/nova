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

import { Inject, Injectable, Optional, SkipSelf } from "@angular/core";
import _filter from "lodash/filter";

import { DEMO_PATH_TOKEN } from "../../../constants/path.constants";
import { LoggerService } from "../../../services/log-service";

/** @ignore */
@Injectable()
export class SourcesService {
    private fileExtensionsRegex = /.*\.(ts|html|less)$/;

    constructor(
        private logger: LoggerService,
        @SkipSelf() @Optional() @Inject(DEMO_PATH_TOKEN) private context: any
    ) {}

    public getSourcesByFilenamePrefix(
        prefix: string
    ): Record<string, Record<string, string>> {
        if (!this.context) {
            this.logger.error(
                `You need to configure SourceService in the module where you import NuiDocsModule e.g. {` +
                    ` provide: DEMO_PATH_TOKEN, useFactory: () => (<any> require).context("!!raw-loader!./components/demo/", true, /.*[.](ts|html|less)$/) }`
            );
            return {};
        }
        const matchingFilePaths = _filter(this.context.keys(), (filePath) => {
            const prefixIndex = filePath.indexOf(prefix);
            const nextChar =
                prefixIndex !== -1
                    ? filePath[prefixIndex + prefix.length]
                    : undefined;
            return prefixIndex !== -1 && (nextChar === "." || nextChar === "/");
        });
        return matchingFilePaths.reduce((acc: any, curr: any) => {
            const fileObj = this.getFileData(curr);
            const key = Object.keys(fileObj)[0];

            if (!acc[key]) {
                Object.assign(acc, fileObj);
            }

            return acc;
        }, {});
    }

    /**
     * Since this goes directly to Plunker we do not need 10K LOC of translations on each Plukner page.
     * That's why it's empty
     */
    public getTranslations(): string {
        return `export const translations = \`<?xml version="1.0" encoding="UTF-8"?>
                <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
                  <file source-language="en-us" datatype="plaintext" original="ng2.template" target-language="en-us">
                    <body>
                    </body>
                  </file>
                </xliff>\`
                `;
    }

    private getFileData(fileName: string): Record<string, string> {
        const regExResultArray = this.fileExtensionsRegex.exec(fileName);
        if (!regExResultArray) {
            return {};
        }

        const content = this.context(fileName);
        const fileContent: string = content?.default ?? content ?? "";
        const extension = <string>fileName.split(".").pop();

        if (extension === "less") {
            return {
                [extension]: fileContent.replace(
                    /@import \(reference\) "([\w-]+\/){0,}([\w-]+)(\.less)?"/g,
                    `@import (reference) "@nova-ui/bits/sdk/less/$1$2"`
                ),
            };
        }

        return { [extension]: fileContent };
    }
}
