import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "nui-schematic-docs-page",
    templateUrl: "schematic-docs-page.component.html",
    styleUrls: ["schematic-docs-page.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class SchematicDocsPageComponent implements OnInit {
    @Input() schematicFolderName: string;
    public schematicHeading: string;
    public angularJsonStylePreprocOptions: string = `
"stylePreprocessorOptions": {
    "includePaths": [
        "node_modules"
    ]
}`;

    ngOnInit() {
        this.schematicHeading = this.schematicFolderName.replace(/-/g, " ");
    }
}
