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
import { IconBasicExampleComponent } from "../icon-basic/icon-basic.example.component";
import { IconSizeExampleComponent } from "../icon-size/icon-size.example.component";
import { IconColorExampleComponent } from "../icon-color/icon-color.example.component";
import { IconHoverExampleComponent } from "../icon-hover/icon-hover.example.component";
import { IconStatusExampleComponent } from "../icon-status/icon-status.example.component";
import { IconChildStatusExampleComponent } from "../icon-child-status/icon-child-status.example.component";
import { IconWithTextExampleComponent } from "../icon-with-text/icon-with-text.example.component";
import { IconCounterExampleComponent } from "../icon-counter/icon-counter.example.component";
import { IconListExampleComponent } from "../icon-list/icon-list.example.component";

@Component({
    selector: "nui-icon-docs-example",
    templateUrl: "./icon-docs.example.component.html",
    imports: [NuiDocsModule, IconBasicExampleComponent, IconSizeExampleComponent, IconColorExampleComponent, IconHoverExampleComponent, IconStatusExampleComponent, IconChildStatusExampleComponent, IconWithTextExampleComponent, IconCounterExampleComponent, IconListExampleComponent]
})
export class IconDocsExampleComponent {}
