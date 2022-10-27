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

/// <reference path="../../../../node_modules/highlight.js/types/index.d.ts" />

import { DOCUMENT } from "@angular/common";
import { Component, Inject, Input, OnInit } from "@angular/core";
import * as hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import less from "highlight.js/lib/languages/less";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";

import { SourcesService } from "../services/sources.service";
import { PlunkerProjectService } from "./plunker-project.service";

/**
 * @dynamic
 * @ignore
 */
@Component({
    templateUrl: "./example-wrapper.component.html",
    selector: "nui-example-wrapper",
    styleUrls: ["./example-wrapper.component.less"],
    providers: [SourcesService],
})
export class ExampleWrapperComponent implements OnInit {
    // Prefix of the example component's filenames
    @Input() filenamePrefix: string;

    // Title to be displayed at the top of the example
    @Input() exampleTitle: string;

    // Indicates whether the source code is being displayed
    @Input() showSource = false;

    public availableThemes = ["light theme", "dark theme"];
    public selectedTheme = this.availableThemes[0];

    public componentSources: {
        ts: string;
        html: string;
        less?: string;
        [key: string]: any;
    };

    public getTooltip() {
        return this.showSource ? "Hide source code" : "Show source code";
    }

    public openPlunker() {
        this.plunkerProjectService.open(
            this.filenamePrefix,
            this.componentSources,
            this.sourcesService.getTranslations()
        );
    }

    constructor(
        private sourcesService: SourcesService,
        @Inject(DOCUMENT) private document: Document,
        private plunkerProjectService: PlunkerProjectService
    ) {
        hljs.registerLanguage("typescript", typescript);
        hljs.registerLanguage("javascript", javascript);
        hljs.registerLanguage("xml", xml);
        hljs.registerLanguage("json", json);
        hljs.registerLanguage("less", less);
    }

    ngOnInit() {
        this.componentSources = this.sourcesService.getSourcesByFilenamePrefix(
            this.filenamePrefix
        );
    }
}
