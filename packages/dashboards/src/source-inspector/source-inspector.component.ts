import { Component, Inject, Input, OnInit, Optional, SkipSelf, ViewEncapsulation } from "@angular/core";
import { DEMO_PATH_TOKEN } from "@nova-ui/bits";
import _filter from "lodash/filter";
import _keys from "lodash/keys";

import { SourceInspectorModes } from "./types";

/** @ignore */
@Component({
    selector: "nui-source-inspector",
    styleUrls: ["./source-inspector.component.less"],
    templateUrl: "./source-inspector.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class SourceInspectorComponent implements OnInit {
    @Input() filenamePrefix: string;
    @Input() mode: SourceInspectorModes = "tabs";

    private fileExtensionsRegex = /.*\.(ts|html|less)$/;

    public componentSources: any;
    get selectedFile() {
        return this._selectedFile;
    }

    set selectedFile(value: string) {
        this._selectedFile = value;

        // Remove when NUI-2704 is finished
        this.shouldCodeRender = false;
        setTimeout(() => {
            this.shouldCodeRender = true;
        }, 100);
    }

    public _selectedFile: string;
    public shouldCodeRender: boolean;

    constructor(
        @SkipSelf() @Optional() @Inject(DEMO_PATH_TOKEN) private context: any
    ) { }

    ngOnInit() {
        this.componentSources = this.getSourcesByFilenamePrefix(this.filenamePrefix);
        this.selectedFile = this.getFileNames(this.componentSources)[0];
    }

    public getSourcesByFilenamePrefix(prefix: string): { [fileName: string]: string } {
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

    private getFileData(fileName: string): { [fileName: string]: string } {
        const regExResultArray = this.fileExtensionsRegex.exec(fileName);
        // this.context returns source code (because of raw loading) of the requested module
        return regExResultArray ? {
            // @ts-ignore: Suppressing to avoid changing default behaviour
            [fileName.split("/").pop()]: this.context(fileName),
        } : {};
    }

    public getFileNames(componentSources: any): Array<string> {
        return _keys(componentSources);
    }
}
