import { Component } from "@angular/core";

@Component({
    selector: "theming-docs-example",
    templateUrl: "./theming-docs.example.component.html",
    styleUrls: ["./theming-docs.example.component.less"],
})
export class ThemingDocsExampleComponent {
    public lessCode = `
@import (reference) "nui-framework-variables";

.sample-class {
    background: var(--nui-color-bg-workspace, @nui-color-bg-workspace)
    border: 1px solid var(--nui-color-line-default, @nui-color-line-default);
}`;
}
