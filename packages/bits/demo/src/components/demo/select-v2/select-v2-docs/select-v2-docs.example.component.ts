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
import { SelectV2BasicExampleComponent } from "../select-v2-basic/select-v2-basic.example.component";
import { SelectV2GettingValueExampleComponent } from "../select-v2-getting-value/select-v2-getting-value.example.component";
import { SelectV2SettingValueExampleComponent } from "../select-v2-setting-value/select-v2-setting-value.example.component";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { SelectV2CustomizeOptionsExampleComponent } from "../select-v2-customize-options/select-v2-customize-options.example.component";
import { SelectV2CustomContentExampleComponent } from "../select-v2-custom-content/select-v2-custom-content.example.component";
import { SelectV2GroupedItemsExampleComponent } from "../select-v2-grouped-items/select-v2-grouped-items.example.component";
import { SelectV2ReactiveFormFieldExampleComponent } from "../select-v2-reactive-form-field/select-v2-reactive-form-field.example.component";
import { SelectV2VirtualScrollExampleComponent } from "../select-v2-virtual-scroll/select-v2-virtual-scroll.example.component";
import { SelectV2DisabledExampleComponent } from "../select-v2-disabled/select-v2-disabled.example.component";
import { SelectV2ErrorExampleComponent } from "../select-v2-error/select-v2-error.example.component";
import { SelectV2StylingExampleComponent } from "../select-v2-styling/select-v2-styling.example.component";
import { SelectV2InlineExampleComponent } from "../select-v2-inline/select-v2-inline.example.component";
import { SelectV2OverlayConfigExampleComponent } from "../select-v2-overlay-config/select-v2-overlay-config.example.component";
import { SelectV2CustomControlExampleComponent } from "../select-v2-custom-control/select-v2-custom-control.example.component";
import { SelectV2ColorPickerComponent } from "../select-v2-color-picker/select-v2-color-picker.component";

@Component({
    selector: "nui-select-v2-docs-example",
    templateUrl: "./select-v2-docs.example.component.html",
    styleUrls: ["select-v2-docs.example.component.less"],
    imports: [NuiDocsModule, SelectV2BasicExampleComponent, SelectV2GettingValueExampleComponent, SelectV2SettingValueExampleComponent, NuiMessageModule, SelectV2CustomizeOptionsExampleComponent, SelectV2CustomContentExampleComponent, SelectV2GroupedItemsExampleComponent, SelectV2ReactiveFormFieldExampleComponent, SelectV2VirtualScrollExampleComponent, SelectV2DisabledExampleComponent, SelectV2ErrorExampleComponent, SelectV2StylingExampleComponent, SelectV2InlineExampleComponent, SelectV2OverlayConfigExampleComponent, SelectV2CustomControlExampleComponent, SelectV2ColorPickerComponent]
})
export class SelectV2DocsComponent {}
