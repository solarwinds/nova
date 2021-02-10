import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import hljs from "highlight.js";

import { ThemeSwitchService } from "../../../../src/services/theme-switch.service";

@Component({
    selector: "nui-app",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {

    constructor(public themeSwitcherService: ThemeSwitchService) { }

    public ngOnInit(): void {
        hljs.registerLanguage("typescript", require("highlight.js/lib/languages/typescript"));
        hljs.registerLanguage("javascript", require("highlight.js/lib/languages/javascript"));
        hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"));
        hljs.registerLanguage("json", require("highlight.js/lib/languages/json"));
        hljs.registerLanguage("less", require("highlight.js/lib/languages/less"));
    }
}
