import { A11yModule } from "@angular/cdk/a11y";
import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiDividerModule } from "../divider/divider.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiMenuModule } from "../menu/menu.module";

import { ToolbarGroupComponent } from "./toolbar-group.component";
import { ToolbarItemComponent } from "./toolbar-item.component";
import { ToolbarSplitterComponent } from "./toolbar-splitter.component";
import { ToolbarComponent } from "./toolbar.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        A11yModule,
        NuiIconModule,
        NuiMenuModule,
        NuiDividerModule,
        NuiButtonModule,
    ],
    declarations: [
        ToolbarComponent,
        ToolbarItemComponent,
        ToolbarSplitterComponent,
        ToolbarGroupComponent,
    ],
    exports: [
        ToolbarComponent,
        ToolbarItemComponent,
        ToolbarSplitterComponent,
        ToolbarGroupComponent,
    ],
    providers: [],
})
export class NuiToolbarModule {
}
