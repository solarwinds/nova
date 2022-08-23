import { Component } from "@angular/core";

@Component({
    selector: "nui-tree-docs-example",
    templateUrl: "./tree-docs.example.component.html",
})
export class TreeDocsExampleComponent {
    initialSetupCode = `
// our module where we want to use tree features
import { CdkTreeModule } from "@angular/cdk/tree";

@NgModule({
    imports: [
        CdkTreeModule,
        // other modules that we might need
    ],
    declarations: [ /* our module declaration */],
    exports:      [ /* our exports */ ],
})
export class MyModule {}`.replace("\r\n", "<br/>"); // nice rendering
}
