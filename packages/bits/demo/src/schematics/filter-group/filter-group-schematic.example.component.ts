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

import { Component } from "@angular/core";
import { SchematicDocsPageComponent } from "../utils/schematic-docs-page/schematic-docs-page.component";
import { NuiTabsModule } from "../../../../src/lib/tabgroup/tabs.module";
import { SchematicsDocsCommandComponent } from "../utils/schematic-docs-command/schematic-docs-command.component";
import { SchematicDocsExampleComponent } from "../utils/schematic-docs-example/schematic-docs-example.component";
import { BasicFilterGroupExampleComponent } from "./basic-filter-group/basic-filter-group.example.component";
import { CustomTemplateFilterGroupExampleComponent } from "./custom-template-filter-group/custom-template-filter-group.example.component";
import { CustomDataSourceFilterGroupExampleComponent } from "./custom-data-source-filter-group/custom-data-source-filter-group.example.component";
import { FakeServer } from "./fake-http.service";
import { DialogFilterGroupExampleComponent } from "./dialog-filter-group/dialog-filter-group.example.component";

@Component({
    selector: "nui-filter-group-composite-basic",
    templateUrl: "filter-group-schematic.example.component.html",
    imports: [SchematicDocsPageComponent, NuiTabsModule, SchematicsDocsCommandComponent, SchematicDocsExampleComponent, BasicFilterGroupExampleComponent, CustomTemplateFilterGroupExampleComponent, CustomDataSourceFilterGroupExampleComponent, FakeServer, DialogFilterGroupExampleComponent]
})
export class FilterGroupSchematicExampleComponent {
    constructor() {}
}
