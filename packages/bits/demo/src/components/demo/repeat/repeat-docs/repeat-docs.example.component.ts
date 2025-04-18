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

import { IRepeatItemConfig, RepeatComponent } from "@nova-ui/bits";
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { RepeatSimpleExampleComponent } from "../repeat-simple/repeat-simple.example.component";
import { RepeatDragSimpleExampleComponent } from "../repeat-drag-simple/repeat-drag-simple.example.component";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { RepeatReorderSimpleExampleComponent } from "../repeat-reorder-simple/repeat-reorder-simple-example.component";
import { RepeatDragHandleExampleComponent } from "../repeat-drag-handle/repeat-drag-handle.example.component";
import { RepeatDragPreviewExampleComponent } from "../repeat-drag-preview/repeat-drag-preview.example.component";
import { RepeatReorderItemConfigExampleComponent } from "../repeat-reorder-item-config/repeat-reorder-item-config-example.component";
import { RepeatMultiSelectionExampleComponent } from "../repeat-multi-selection/repeat-multi-selection.example.component";
import { RepeatDisabledMultiSelectionExampleComponent } from "../repeat-disabled-multi-selection/repeat-disabled-multi-selection.example.component";
import { RepeatSingleSelectionModeExampleComponent } from "../repeat-single-selection-mode/repeat-single-selection-mode.example.component";
import { RepeatRadioSelectionModeExampleComponent } from "../repeat-radio-selection-mode/repeat-radio-selection-mode.example.component";
import { RepeatRadioWithNonRequiredSelectionModeExampleComponent } from "../repeat-radio-with-non-required-selection-mode/repeat-radio-with-non-required-selection-mode.example.component";
import { RepeatSingleWithRequiredSelectionModeExampleComponent } from "../repeat-single-with-required-selection-mode/repeat-single-with-required-selection-mode.example.component";

@Component({
    selector: "nui-repeat-example",
    templateUrl: "./repeat-docs.example.component.html",
    imports: [NuiDocsModule, RepeatSimpleExampleComponent, RepeatDragSimpleExampleComponent, NuiMessageModule, RepeatReorderSimpleExampleComponent, RepeatDragHandleExampleComponent, RepeatDragPreviewExampleComponent, RepeatReorderItemConfigExampleComponent, RepeatMultiSelectionExampleComponent, RepeatDisabledMultiSelectionExampleComponent, RepeatSingleSelectionModeExampleComponent, RepeatRadioSelectionModeExampleComponent, RepeatRadioWithNonRequiredSelectionModeExampleComponent, RepeatSingleWithRequiredSelectionModeExampleComponent]
})
export class RepeatExampleComponent {
    getItemConfigKey(key: keyof IRepeatItemConfig): string {
        return key;
    }

    getRepeatPropKey(key: keyof RepeatComponent): string {
        return key;
    }
}
