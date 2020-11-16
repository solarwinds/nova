import { Component, Inject, Input, OnInit, Optional, SkipSelf, ViewEncapsulation } from "@angular/core";
import _set from "lodash/set";

import { DEMO_PATH_TOKEN } from "../../../../../src/constants/path.constant";

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

    get selectedFile() {
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

    constructor(@SkipSelf() @Optional() @Inject(DEMO_PATH_TOKEN) private context: any) {}

    ngOnInit() {
        this.componentSources = this.getSourcesByFilenamePrefix(this.exampleFolderName);
    }

    public getSource(fileName: string) {
        return this.rawData[fileName];
    }

    public selectFile(name: string) {
        this.selectedFile = name;
        this.selectedFileOpen = true;
    }

    public isSelectedFileOpen(): boolean {
        return this.selectedFileOpen;
    }

    public onSelectedFileOpenChange(event: boolean) {
        this.selectedFileOpen = event;
    }

    private getSourcesByFilenamePrefix(prefix: string) {
        const matchingFilePaths = this.context.keys().filter((filePath: string) => {
            const prefixIndex = filePath.indexOf(prefix);
            const nextChar = prefixIndex !== -1 ? filePath[prefixIndex + prefix.length] : undefined;
            return prefixIndex !== -1 && (nextChar === "." || nextChar === "/");
        });

        return matchingFilePaths.reduce((dataset: any, fileName: any) => {
            const fileObj = this.getFileData(fileName);
            const splitPath = fileName.substr(fileName.indexOf(prefix)).split("/");
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
            fileContent = this.context(fileName).default;

            const extension = <string>fileName.split(".").pop();
            if (extension === "less") {
                fileContent = fileContent.replace(
                    /@import \(reference\) "([\w-]+\/){0,}([\w-]+)(\.less)?"/g,
                    `@import (reference) "@solarwinds/nova-bits/sdk/less/$1$2"`
                );
            }
        }

        return fileContent;
    }

}
