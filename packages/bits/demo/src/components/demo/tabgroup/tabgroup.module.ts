import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiContentModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiMessageModule,
    NuiSwitchModule,
    NuiTabsModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    TabContentAboutExampleComponent,
    TabContentSettingsExampleComponent,
    TabContentStatisticsExampleComponent,
    TabgroupDocsExampleComponent,
    TabHeadingGroupDynamicExampleComponent,
    TabHeadingGroupHorizontalExampleComponent,
    TabHeadingGroupHorizontalWithIconsExampleComponent,
    TabHeadingGroupHorizontalWithIconsOnlyExampleComponent,
    TabHeadingGroupResponsiveExampleComponent,
    TabHeadingGroupTestComponent,
    TabHeadingGroupVerticalExampleComponent,
    TabHeadingGroupVerticalWithIconsExampleComponent,
    TabHeadingGroupWithContentExampleComponent,
    TabHeadingGroupWithIconsExampleComponent,
    TabHeadingGroupWithRouterExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: TabgroupDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
        children: [
            {
                path: "",
                redirectTo: "tab-settings",
                pathMatch: "full",
                data: {
                    srlc: {
                        stage: SrlcStage.ga,
                    },
                },
            },
            {
                path: "tab-settings",
                component: TabContentSettingsExampleComponent,
                data: {
                    srlc: {
                        stage: SrlcStage.ga,
                    },
                    showThemeSwitcher: true,
                },
            },
            {
                path: "tab-statistics",
                component: TabContentStatisticsExampleComponent,
                data: {
                    srlc: {
                        stage: SrlcStage.ga,
                    },
                    showThemeSwitcher: true,
                },
            },
            {
                path: "tab-about",
                component: TabContentAboutExampleComponent,
                data: {
                    srlc: {
                        stage: SrlcStage.ga,
                    },
                    showThemeSwitcher: true,
                },
            },
        ],
    },
    {
        path: "tabgroup-test",
        component: TabHeadingGroupTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiTabsModule,
        NuiSwitchModule,
        NuiContentModule,
        NuiValidationMessageModule,
        NuiTextboxModule,
        NuiFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NuiMessageModule,
        NuiExpanderModule,
        NuiDocsModule,
        NuiIconModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TabgroupDocsExampleComponent,
        TabContentAboutExampleComponent,
        TabContentSettingsExampleComponent,
        TabContentStatisticsExampleComponent,
        TabHeadingGroupTestComponent,
        TabHeadingGroupDynamicExampleComponent,
        TabHeadingGroupWithIconsExampleComponent,
        TabHeadingGroupHorizontalExampleComponent,
        TabHeadingGroupHorizontalWithIconsExampleComponent,
        TabHeadingGroupWithContentExampleComponent,
        TabHeadingGroupWithRouterExampleComponent,
        TabHeadingGroupVerticalExampleComponent,
        TabHeadingGroupVerticalWithIconsExampleComponent,
        TabHeadingGroupHorizontalWithIconsOnlyExampleComponent,
        TabHeadingGroupResponsiveExampleComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () =>
                (<any>require).context(
                    `!!raw-loader!./`,
                    true,
                    /.*\.(ts|html|less)$/
                ),
        },
    ],
    exports: [RouterModule],
})
export class TabgroupModule {}
