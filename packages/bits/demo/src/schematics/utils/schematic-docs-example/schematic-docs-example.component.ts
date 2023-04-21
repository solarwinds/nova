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

import {
    Component,
    Inject,
    Input,
    OnInit,
    Optional,
    SkipSelf,
    ViewEncapsulation,
} from "@angular/core";
import _set from "lodash/set";

import { DEMO_PATH_TOKEN } from "@nova-ui/bits";

@Component({
    selector: "nui-schematic-docs-example",
    templateUrl: "schematic-docs-example.component.html",
    styleUrls: ["schematic-docs-example.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class SchematicDocsExampleComponent implements OnInit {
    @Input() exampleFolderName: string;
    public componentSources: string[];
    public shouldCodeRender: boolean;

    private fileExtensionsRegex = /.*\.(ts|html|less)$/;
    private rawData: any = {};

    private _selectedFile: string;
    private selectedFileOpen: boolean;

    get selectedFile(): string {
        return this._selectedFile;
    }

    set selectedFile(value: string) {
        this._selectedFile = value;
        // TODO Remove when NUI-2704 is finished
        this.shouldCodeRender = false;
        setTimeout(() => {
            this.shouldCodeRender = true;
        }, 100);
    }

    constructor(
        @SkipSelf() @Optional() @Inject(DEMO_PATH_TOKEN) private context: any
    ) {}

    public ngOnInit(): void {
        this.componentSources = this.getSourcesByFilenamePrefix(
            this.exampleFolderName
        );
    }

    public getSource(fileName: string): string {
        return this.rawData[fileName] ?? "";
    }

    public selectFile(name: string): void {
        this.selectedFile = name;
        this.selectedFileOpen = true;
    }

    public isSelectedFileOpen(): boolean {
        return this.selectedFileOpen;
    }

    public onSelectedFileOpenChange(event: boolean): void {
        this.selectedFileOpen = event;
    }

    private getSourcesByFilenamePrefix(prefix: string) {
        const matchingFilePaths = this.context
            .keys()
            .filter((filePath: string) => {
                const prefixIndex = filePath.indexOf(prefix);
                const nextChar =
                    prefixIndex !== -1
                        ? filePath[prefixIndex + prefix.length]
                        : undefined;
                return (
                    prefixIndex !== -1 && (nextChar === "." || nextChar === "/")
                );
            });

        return matchingFilePaths.reduce((dataset: any, fileName: any) => {
            const fileObj = this.getFileData(fileName);
            const splitPath = fileName
                .substr(fileName.indexOf(prefix))
                .split("/");
            const pathToSourceCode = [];

            this.rawData[splitPath[splitPath.length - 1]] = fileObj;

            for (let i = splitPath.length; i > 0; i--) {
                const shifted = splitPath.shift();
                pathToSourceCode.push(shifted);
            }
            return _set(dataset, pathToSourceCode, fileObj);
        }, {});
    }

    private getFileData(fileName: string) {
        let fileContent = "";
        const regExResultArray = this.fileExtensionsRegex.exec(fileName);
        if (regExResultArray) {
            // todo rewrite to context
            fileContent = this.context(fileName).default;

            const extension = <string>fileName.split(".").pop();
            if (extension === "less") {
                fileContent = fileContent.replace(
                    /@import \(reference\) "([\w-]+\/){0,}([\w-]+)(\.less)?"/g,
                    `@import (reference) "@nova-ui/bits/sdk/less/$1$2"`
                );
            }
        }

        return fileContent;
    }
}
