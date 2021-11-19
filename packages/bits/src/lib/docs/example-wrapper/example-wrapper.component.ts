/// <reference path="../../../../node_modules/highlight.js/types/index.d.ts" />

import { DOCUMENT } from "@angular/common";
import {
    Component,
    Inject,
    Input,
    OnInit,
} from "@angular/core";

import { FileData, SourcesService } from "../services/sources.service";

import { PlunkerProjectService } from "./plunker-project.service";

import * as hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import less from "highlight.js/lib/languages/less";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import typescript from "highlight.js/lib/languages/typescript";

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

    public componentSources: Record<string, FileData>;

    public getTooltip(): string {
        return this.showSource ? "Hide source code" : "Show source code";
    }

    public openPlunker(): void {
        this.plunkerProjectService.open(this.filenamePrefix, this.componentSources, this.sourcesService.getTranslations());
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

    ngOnInit(): void {
        this.componentSources = this.sourcesService.getSourcesByFilenamePrefix(this.filenamePrefix);
    }
}
