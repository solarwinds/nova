import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule, NuiDialogModule,
    NuiDividerModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiMessageModule,
    NuiOverlayAdditionsModule,
    NuiSelectV2Module,
    NuiSwitchModule,
    NuiValidationMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    SelectV2BasicExampleComponent,
    SelectV2ColorPickerComponent,
    SelectV2CustomContentExampleComponent,
    SelectV2CustomControlExampleComponent,
    SelectV2CustomizeOptionsExampleComponent,
    SelectV2DisabledExampleComponent,
    SelectV2DocsComponent,
    SelectV2ErrorExampleComponent,
    SelectV2GettingValueExampleComponent,
    SelectV2GroupedItemsExampleComponent,
    SelectV2InlineExampleComponent,
    SelectV2OptionsChangedExampleComponent,
    SelectV2OverlayConfigExampleComponent,
    SelectV2ReactiveFormFieldExampleComponent,
    SelectV2SettingValueExampleComponent,
    SelectV2StylingExampleComponent,
    SelectV2TestExampleComponent,
    SelectV2VirtualScrollExampleComponent,
} from "./index";


const routes = [
    {
        path: "",
        component: SelectV2DocsComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "basic",
        component: SelectV2BasicExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "getting-value",
        component: SelectV2GettingValueExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "setting-value",
        component: SelectV2SettingValueExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "customize-options",
        component: SelectV2CustomizeOptionsExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "grouped",
        component: SelectV2GroupedItemsExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "disabled",
        component: SelectV2DisabledExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "error",
        component: SelectV2ErrorExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "inline",
        component: SelectV2InlineExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "styling",
        component: SelectV2StylingExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "virtual-scroll",
        component: SelectV2VirtualScrollExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "overlay-config",
        component: SelectV2OverlayConfigExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "reactive-form",
        component: SelectV2ReactiveFormFieldExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "custom-control",
        component: SelectV2CustomControlExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "custom-content",
        component: SelectV2CustomContentExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "options-changed",
        component: SelectV2OptionsChangedExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "color-picker",
        component: SelectV2ColorPickerComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "test",
        component: SelectV2TestExampleComponent,
        data: {
            "srlc": {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiIconModule,
        NuiDividerModule,
        NuiSelectV2Module,
        ReactiveFormsModule,
        FormsModule,
        NuiSwitchModule,
        NuiValidationMessageModule,
        NuiFormFieldModule,
        NuiDocsModule,
        NuiMessageModule,
        ScrollingModule,
        NuiDialogModule,
        NuiOverlayAdditionsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        SelectV2BasicExampleComponent,
        SelectV2DisabledExampleComponent,
        SelectV2ErrorExampleComponent,
        SelectV2InlineExampleComponent,
        SelectV2DocsComponent,
        SelectV2GroupedItemsExampleComponent,
        SelectV2StylingExampleComponent,
        SelectV2VirtualScrollExampleComponent,
        SelectV2OverlayConfigExampleComponent,
        SelectV2ReactiveFormFieldExampleComponent,
        SelectV2CustomizeOptionsExampleComponent,
        SelectV2CustomControlExampleComponent,
        SelectV2TestExampleComponent,
        SelectV2CustomContentExampleComponent,
        SelectV2OptionsChangedExampleComponent,
        SelectV2GettingValueExampleComponent,
        SelectV2SettingValueExampleComponent,
        SelectV2ColorPickerComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/),
        },
    ],
    exports: [
        RouterModule,
    ],
})
export class SelectV2Module {
}
