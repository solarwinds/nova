import { Inject, Injectable, Optional, SkipSelf } from "@angular/core";
import _filter from "lodash/filter";

import { DEMO_PATH_TOKEN } from "../../../constants/path.constant";
import { LoggerService } from "../../../services/log-service";

/** @ignore */
@Injectable()
export class SourcesService {
    private fileExtensionsRegex = /.*\.(ts|html|less)$/;

    constructor(
        private logger: LoggerService,
        @SkipSelf() @Optional() @Inject(DEMO_PATH_TOKEN) private context: any
    ) { }

    public getSourcesByFilenamePrefix(prefix: string) {
        if (!this.context) {
            this.logger.error(`You need to configure SourceService in the module where you import NuiDocsModule
                                e.g. { provide: DEMO_PATH_TOKEN,
                                useFactory: () => (<any> require).context("!!raw-loader!./components/demo/", true, /.*\.(ts|html|less)$/)}, `);
            return;
        }
        const matchingFilePaths = _filter(this.context.keys(), (filePath) => {
            const prefixIndex = filePath.indexOf(prefix);
            const nextChar = prefixIndex !== -1 ? filePath[prefixIndex + prefix.length] : undefined;
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
    public getTranslations() {
        return `export const translations = \`<?xml version="1.0" encoding="UTF-8"?>
                <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
                  <file source-language="en-us" datatype="plaintext" original="ng2.template" target-language="en-us">
                    <body>
                    </body>
                  </file>
                </xliff>\`
                `;
    }

    private getFileData(fileName: string) {
        let fileData = {};
        const regExResultArray = this.fileExtensionsRegex.exec(fileName);
        if (regExResultArray) {
            let fileContent = this.context(fileName).default;
            const extension = <string>fileName.split(".").pop();
            if (extension === "less") {
                fileContent = fileContent.replace(
                    /@import \(reference\) "([\w-]+\/){0,}([\w-]+)(\.less)?"/g,
                    `@import (reference) "@nova-ui/bits/sdk/less/$1$2"`
                );
            }

            fileData = { [extension]: fileContent };
        }

        return fileData;
    }
}
