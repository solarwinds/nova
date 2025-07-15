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

import { Component, Input, OnInit, input } from "@angular/core";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import less from "highlight.js/lib/languages/less";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";

import { CodeSandboxService } from "./code-sandbox.service";
import { FileMetadata, SourcesService } from "../services/sources.service";

/**
 * @dynamic
 * @ignore
 */
@Component({
    templateUrl: "./example-wrapper.component.html",
    selector: "nui-example-wrapper",
    styleUrls: ["./example-wrapper.component.less"],
    standalone: false,
})
export class ExampleWrapperComponent implements OnInit {
    // Prefix of the example component's filenames
    readonly filenamePrefix = input<string>("");

    // Title to be displayed at the top of the example
    readonly exampleTitle = input<string>("");

    // Indicates whether the source code is being displayed
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() showSource = false;

    public componentSources: FileMetadata[];

    constructor(
        private sourcesService: SourcesService,
        private codeSandboxService: CodeSandboxService
    ) {
        hljs.registerLanguage("typescript", typescript);
        hljs.registerLanguage("javascript", javascript);
        hljs.registerLanguage("xml", xml);
        hljs.registerLanguage("json", json);
        hljs.registerLanguage("less", less);
    }

    public getTooltip(): string {
        return this.showSource ? "Hide source code" : "Show source code";
    }

    public async openCodeSandboxExample(): Promise<void> {
        await this.codeSandboxService.open(
            this.filenamePrefix()()()(),
            this.componentSources
        );
    }

    public async ngOnInit(): Promise<void> {
        this.componentSources =
            await this.sourcesService.getSourcesByFilenamePrefix(
                this.filenamePrefix()()()()
            ) ?? [];
    }

    public getExampleComponents(fileType: string): string {
        return (
            this.componentSources?.find(
                (component) =>
                    component.fileName.includes(this.filenamePrefix()()()()) &&
                    component.fileType === fileType
            )?.fileContent ?? ""
        );
    }
}
