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
import { TextboxBasicExampleComponent } from "../textbox-basic/textbox-basic.example.component";
import { TextboxPlaceholderExampleComponent } from "../textbox-placeholder/textbox-placeholder.example.component";
import { TextboxDisabledExampleComponent } from "../textbox-disabled/textbox-disabled.example";
import { TextboxReadonlyExampleComponent } from "../textbox-readonly/textbox-readonly.example.component";
import { TextboxRequiredExampleComponent } from "../textbox-required/textbox-required.example.component";
import { TextboxHintExampleComponent } from "../textbox-hint/textbox-hint.example.component";
import { TextboxInfoExampleComponent } from "../textbox-info/textbox-info.example.component";
import { TextboxAreaExampleComponent } from "../textbox-area/textbox-area.example.component";
import { TextboxCustomBoxWidthExampleComponent } from "../textbox-custom-width/textbox-custom-width.example.component";
import { TextboxGettingValueExampleComponent } from "../textbox-getting-value/textbox-getting-value.example.component";

@Component({
    selector: "nui-textbox-docs-example",
    templateUrl: "./textbox-docs.example.component.html",
    imports: [NuiDocsModule, TextboxBasicExampleComponent, TextboxPlaceholderExampleComponent, TextboxDisabledExampleComponent, TextboxReadonlyExampleComponent, TextboxRequiredExampleComponent, TextboxHintExampleComponent, TextboxInfoExampleComponent, TextboxAreaExampleComponent, TextboxCustomBoxWidthExampleComponent, TextboxGettingValueExampleComponent]
})
export class TextboxDocsExampleComponent {}
