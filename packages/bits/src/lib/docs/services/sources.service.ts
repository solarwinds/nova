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

import { Inject, Injectable, Optional } from "@angular/core";

import { DEMO_PATH_TOKEN } from "../../../constants/path.constants";
import { LoggerService } from "../../../services/log-service";
import { CodeSourceFiles } from "../../../types";

/** @ignore */
@Injectable()
export class SourcesService {
    constructor(
        private logger: LoggerService,
        @Optional()
        @Inject(DEMO_PATH_TOKEN)
        private config: CodeSourceFiles
    ) {}

    public async getSourcesByFilenamePrefix(
        filenamePrefix: string
    ): Promise<FileMetadata[]> {
        if (!this.config.context) {
            this.logger.error(
                `You need to configure SourceService in the module where you import NuiDocsModule e.g. {` +
                    ` provide: DEMO_PATH_TOKEN, useValue: getDemoFiles(<example>) }`
            );
            return [];
        }

        const contentFiles = await Promise.all(
            this.config.files.map(async (file) =>
                file.content().then((content) => ({
                    content,
                    path: file.path,
                }))
            )
        );
        const filteredContentFiles = contentFiles.filter(
            (file) =>
                file.path.includes(`${filenamePrefix}/`) ||
                file.path.includes("package.json")
        );

        return filteredContentFiles.map((file) => ({
            filePath: this.getTrimmedFilePath(file.path, filenamePrefix),
            fileContent: file.content,
            fileType: this.getFileType(file.path),
            fileName: this.getFilename(file.path),
        })) as FileMetadata[];
    }

    private getFilename(filePath: string): string {
        return filePath.split("/").pop() ?? "";
    }

    private getFileType(filePath: string): string {
        return filePath.split(".").pop() ?? "";
    }

    private getTrimmedFilePath(
        filePath: string,
        filenamePrefix: string
    ): string {
        return filePath.slice(
            filePath.indexOf(filenamePrefix) + filenamePrefix.length + 1
        );
    }
}

export interface FileMetadata {
    filePath: string;
    fileContent: string;
    fileType: string;
    fileName: string;
}
