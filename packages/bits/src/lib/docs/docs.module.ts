import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiImageModule } from "../image/image.module";
import { NuiMessageModule } from "../message/message.module";
import { NuiSelectModule } from "../select/select.module";
import { NuiSwitchModule } from "../switch/switch.module";
import { NuiTabsModule } from "../tabgroup/tabs.module";
import { NuiToastModule } from "../toast/toast.module";
import { NuiTooltipModule } from "../tooltip/tooltip.module";
import { CopyTextComponent } from "./copy-text/copy-text.component";
import { ExampleCodeComponent } from "./example-code/example-code.component";
import { ExampleWrapperComponent } from "./example-wrapper/example-wrapper.component";
import { SrlcIndicatorComponent } from "./srlc-indicator/srlc-indicator.component";
import { ThemeSwitcherComponent } from "./theme-switcher/theme-switcher.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NuiCommonModule,
        NuiMessageModule,
        NuiSelectModule,
        NuiTabsModule,
        NuiToastModule,
        NuiTooltipModule,
        NuiIconModule,
        NuiButtonModule,
        NuiSwitchModule,
        NuiImageModule,
    ],
    exports: [
        CommonModule,
        RouterModule,
        CopyTextComponent,
        ExampleWrapperComponent,
        SrlcIndicatorComponent,
        ThemeSwitcherComponent,
        ExampleCodeComponent,
    ],
    declarations: [
        CopyTextComponent,
        ExampleWrapperComponent,
        SrlcIndicatorComponent,
        ThemeSwitcherComponent,
        ExampleCodeComponent,
    ],
})
export class NuiDocsModule {}
