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
import { ButtonBasicExampleComponent } from "../button-basic/button-basic.example.component";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { ButtonDisplayStylePrimaryExampleComponent } from "../button-display-style-primary/button-display-style-primary.example.component";
import { ButtonDisplayStyleActionExampleComponent } from "../button-display-style-action/button-display-style-action.example.component";
import { ButtonDisplayStyleDestructiveExampleComponent } from "../button-display-style-destructive/button-display-style-destructive.example.component";
import { ButtonSizeExampleComponent } from "../button-size/button-size.example.component";
import { ButtonWithLongTextExampleComponent } from "../button-long-text/button-with-long-text-example.component";
import { ButtonWithIconExampleComponent } from "../button-with-icon/button-with-icon.example.component";
import { ButtonWithIconRightExampleComponent } from "../button-with-icon-right/button-with-icon-right.example.component";
import { ButtonWithIconCustomColorExampleComponent } from "../button-with-icon-custom-color/button-with-icon-custom-color.example.component";
import { ButtonWithIconOnlyExampleComponent } from "../button-with-icon-only/button-with-icon-only.example.component";
import { ButtonRepeatableExampleComponent } from "../button-repeatable/button-repeatable.example.component";
import { ButtonBusyExampleComponent } from "../button-busy/button-busy.example.component";
import { ButtonGroupExampleComponent } from "../button-group/button-group.example.component";

@Component({
    selector: "nui-button-docs-example",
    templateUrl: "./button-docs.example.component.html",
    imports: [NuiDocsModule, ButtonBasicExampleComponent, NuiMessageModule, ButtonDisplayStylePrimaryExampleComponent, ButtonDisplayStyleActionExampleComponent, ButtonDisplayStyleDestructiveExampleComponent, ButtonSizeExampleComponent, ButtonWithLongTextExampleComponent, ButtonWithIconExampleComponent, ButtonWithIconRightExampleComponent, ButtonWithIconCustomColorExampleComponent, ButtonWithIconOnlyExampleComponent, ButtonRepeatableExampleComponent, ButtonBusyExampleComponent, ButtonGroupExampleComponent]
})
export class ButtonDocsComponent {}
