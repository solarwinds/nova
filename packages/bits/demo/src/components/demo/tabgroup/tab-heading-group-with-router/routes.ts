import { TabContentAboutExampleComponent } from "./tab-content/about/tab-content-about.example.component";
import { TabContentSettingsExampleComponent } from "./tab-content/settings/tab-content-settings.example.component";
import { TabContentStatisticsExampleComponent } from "./tab-content/statistics/tab-content-statistics.example.component";
import { TabHeadingGroupWithRouterExampleComponent } from "./tab-heading-group-with-router.example.component";

export const ROUTES = [
    {
        path: "",
        component: TabHeadingGroupWithRouterExampleComponent,
        children: [
            {
                path: "tab-statistics",
                component: TabContentStatisticsExampleComponent,
            },
            {
                path: "tab-settings",
                component: TabContentSettingsExampleComponent,
            },
            {
                path: "tab-about",
                component: TabContentAboutExampleComponent,
            },
        ],
    },
];
