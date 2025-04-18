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
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { PanelBasicExampleComponent } from "../panel-basic/panel-basic.example.component";
import { PanelPositionExampleComponent } from "../panel-position/panel-position.example.component";
import { PanelSizeExampleComponent } from "../panel-size/panel-size.example.component";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { PanelEmbeddedContentExampleComponent } from "../panel-embedded-content/panel-embedded-content.example.component";
import { PanelCustomStylesExampleComponent } from "../panel-custom-styles/panel-\u0441ustom-styles.example.component";
import { PanelCollapseExampleComponent } from "../panel-collapse/panel-collapse.example.component";
import { PanelHideExampleComponent } from "../panel-hide/panel-hide.example.component";
import { PanelHoverableExampleComponent } from "../panel-hoverable/panel-hoverable.example.component";
import { PanelFloatExampleComponent } from "../panel-float/panel-float.example.component";
import { PanelResizeExampleComponent } from "../panel-resize/panel-resize.example.component";
import { PanelCollapseTopOrientedExampleComponent } from "../panel-collapse-top-oriented/panel-collapse-top-oriented.example.component";
import { PanelCollapseOutsideControlExampleComponent } from "../panel-collapse-outside-control/panel-collapse-outside-control.example.component";
import { PanelHideOutsideControlExampleComponent } from "../panel-hide-outside-control/panel-hide-outside-control.example.component";
import { PanelNestedExampleComponent } from "../panel-nested/panel-nested.example.component";

@Component({
    selector: "nui-panel-docs-example",
    templateUrl: "./panel-docs.example.component.html",
    imports: [NuiDocsModule, PanelBasicExampleComponent, PanelPositionExampleComponent, PanelSizeExampleComponent, NuiMessageModule, PanelEmbeddedContentExampleComponent, PanelCustomStylesExampleComponent, PanelCollapseExampleComponent, PanelHideExampleComponent, PanelHoverableExampleComponent, PanelFloatExampleComponent, PanelResizeExampleComponent, PanelCollapseTopOrientedExampleComponent, PanelCollapseOutsideControlExampleComponent, PanelHideOutsideControlExampleComponent, PanelNestedExampleComponent]
})
export class PanelDocsExampleComponent {}
