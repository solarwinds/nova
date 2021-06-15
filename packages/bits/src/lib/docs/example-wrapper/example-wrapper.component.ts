import { DOCUMENT } from "@angular/common";
import {
    Component,
    Inject,
    Input,
    OnInit,
} from "@angular/core";

import { SourcesService } from "../services/sources.service";

import { PlunkerProjectService } from "./plunker-project.service";

const hljs = require("highlight.js/lib/core");

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

    public componentSources: { ts: string, html: string, less?: string, [key: string]: any };

    public getTooltip() {
        return this.showSource ? "Hide source code" : "Show source code";
    }

    public openPlunker() {
        this.plunkerProjectService.open(this.filenamePrefix, this.componentSources, this.sourcesService.getTranslations());
    }

    constructor(
        private sourcesService: SourcesService,
        @Inject(DOCUMENT) private document: Document,
        private plunkerProjectService: PlunkerProjectService
    ) {
        hljs.registerLanguage("typescript", require("highlight.js/lib/languages/typescript"));
        hljs.registerLanguage("javascript", require("highlight.js/lib/languages/javascript"));
        hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"));
        hljs.registerLanguage("json", require("highlight.js/lib/languages/json"));
        hljs.registerLanguage("less", require("highlight.js/lib/languages/less"));
    }

    ngOnInit() {
        this.componentSources = this.sourcesService.getSourcesByFilenamePrefix(this.filenamePrefix);
    }
}
