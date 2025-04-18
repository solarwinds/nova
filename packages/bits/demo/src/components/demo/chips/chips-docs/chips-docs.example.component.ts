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
import { BasicChipsExampleComponent } from "../basic-chips/basic-chips.example.component";
import { GroupedChipsExampleComponent } from "../grouped-chips/grouped-chips.example.component";
import { VerticalFlatChipsExampleComponent } from "../vertical-flat-chips/vertical-flat-chips.example.component";
import { VerticalGroupedChipsExampleComponent } from "../vertical-grouped-chips/vertical-grouped-chips.example.component";
import { AutohideChipsExampleComponent } from "../autohide-chips/autohide-chips.example.component";
import { ChipsOverflowExampleComponent } from "../chips-overflow/chips-overflow.example.component";
import { ChipsCustomCssExampleComponent } from "../chips-custom-css/chips-custom-css.example.component";

@Component({
    selector: "nui-chips-docs-example",
    templateUrl: "./chips-docs.example.component.html",
    imports: [NuiDocsModule, BasicChipsExampleComponent, GroupedChipsExampleComponent, VerticalFlatChipsExampleComponent, VerticalGroupedChipsExampleComponent, AutohideChipsExampleComponent, ChipsOverflowExampleComponent, ChipsCustomCssExampleComponent]
})
export class ChipsDocsExampleComponent {}
