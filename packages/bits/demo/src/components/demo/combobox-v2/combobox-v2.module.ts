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

import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    NuiButtonModule,
    NuiChipsModule,
    NuiDialogModule,
    NuiDividerModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiOverlayAdditionsModule,
    NuiOverlayModule,
    NuiPopoverModule,
    NuiSelectModule,
    NuiSelectV2Module,
    NuiSwitchModule,
    NuiValidationMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    ComboboxV2BasicExampleComponent,
    ComboboxV2CreateOptionExampleComponent,
    ComboboxV2CreateOptionMultiselectExampleComponent,
    ComboboxV2CustomControlExampleComponent,
    ComboboxV2CustomizeOptionsExampleComponent,
    ComboboxV2CustomTypeaheadExampleComponent,
    ComboboxV2DisabledExampleComponent,
    ComboboxV2DocsComponent,
    ComboboxV2ErrorExampleComponent,
    ComboboxV2GettingValueExampleComponent,
    ComboboxV2GroupedOptionsExampleComponent,
    ComboboxV2InlineExampleComponent,
    ComboboxV2MultiselectExampleComponent,
    ComboboxV2OpitionsChangedExampleComponent,
    ComboboxV2OverlayConfigExampleComponent,
    ComboboxV2ReactiveFormFieldExampleComponent,
    ComboboxV2RemoveValueExampleComponent,
    ComboboxV2SettingValueExampleComponent,
    ComboboxV2StylingExampleComponent,
    ComboboxV2TestExampleComponent,
    ComboboxV2TypeaheadExampleComponent,
    ComboboxV2VirtualScrollExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: ComboboxV2DocsComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "basic",
        component: ComboboxV2BasicExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "getting-value",
        component: ComboboxV2GettingValueExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "setting-value",
        component: ComboboxV2SettingValueExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "customize-options",
        component: ComboboxV2CustomizeOptionsExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "typeahead",
        component: ComboboxV2TypeaheadExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "grouped",
        component: ComboboxV2GroupedOptionsExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "remove-value",
        component: ComboboxV2RemoveValueExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "multiselect",
        component: ComboboxV2MultiselectExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "virtual-scroll",
        component: ComboboxV2VirtualScrollExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "overlay-config",
        component: ComboboxV2OverlayConfigExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "disabled",
        component: ComboboxV2DisabledExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "error",
        component: ComboboxV2ErrorExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "inline",
        component: ComboboxV2InlineExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "styling",
        component: ComboboxV2StylingExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "custom-typeahead",
        component: ComboboxV2CustomTypeaheadExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "reactive-form-field",
        component: ComboboxV2ReactiveFormFieldExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "create-option",
        component: ComboboxV2CreateOptionExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "create-option-multiselect",
        component: ComboboxV2CreateOptionMultiselectExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "custom-control",
        component: ComboboxV2CustomControlExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "options-changed",
        component: ComboboxV2OpitionsChangedExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "test",
        component: ComboboxV2TestExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

/** @ignore */
@NgModule({
    imports: [
        NuiIconModule,
        NuiChipsModule,
        FormsModule,
        ReactiveFormsModule,
        NuiDividerModule,
        NuiValidationMessageModule,
        NuiFormFieldModule,
        NuiMenuModule,
        NuiPopoverModule,
        NuiSwitchModule,
        NuiSelectModule,
        NuiSelectV2Module,
        NuiMessageModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiOverlayModule,
        NuiDialogModule,
        ScrollingModule,
        NuiOverlayAdditionsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ComboboxV2BasicExampleComponent,
        ComboboxV2DocsComponent,
        ComboboxV2GroupedOptionsExampleComponent,
        ComboboxV2RemoveValueExampleComponent,
        ComboboxV2VirtualScrollExampleComponent,
        ComboboxV2OverlayConfigExampleComponent,
        ComboboxV2DisabledExampleComponent,
        ComboboxV2ErrorExampleComponent,
        ComboboxV2InlineExampleComponent,
        ComboboxV2StylingExampleComponent,
        ComboboxV2MultiselectExampleComponent,
        ComboboxV2CustomTypeaheadExampleComponent,
        ComboboxV2ReactiveFormFieldExampleComponent,
        ComboboxV2CreateOptionExampleComponent,
        ComboboxV2CreateOptionMultiselectExampleComponent,
        ComboboxV2CustomizeOptionsExampleComponent,
        ComboboxV2CustomControlExampleComponent,
        ComboboxV2TestExampleComponent,
        ComboboxV2OpitionsChangedExampleComponent,
        ComboboxV2TypeaheadExampleComponent,
        ComboboxV2GettingValueExampleComponent,
        ComboboxV2SettingValueExampleComponent,
    ],
    exports: [RouterModule],
})
export default class ComboboxV2Module {}
