import { DragDropModule } from "@angular/cdk/drag-drop";
import { DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiCommonModule,
    NuiDividerModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiIconModule,
    NuiMessageModule,
    NuiOverlayModule,
    NuiPaginatorModule,
    NuiPanelModule,
    NuiPopoverModule,
    NuiProgressModule,
    NuiRadioModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSelectorModule,
    NuiSelectV2Module,
    NuiSorterModule,
    NuiTableModule,
    NuiTextboxModule,
    NuiTimeFramePickerModule,
    SrlcStage,
} from "@nova-ui/bits";

import {DataSourceClientSideFilteringExampleComponent} from "./data-source/client-side/client-side-filtering/client-side-filtering.example.component";
import {DataSourceWithSelectionExampleComponent} from "./data-source/client-side/client-side-with-selection/client-side-with-selection.example.component";
import {DataSourceModule} from "./data-source/data-source.module";
import {
    ClipboardExampleComponent,
    DataFilterBasicExampleComponent,
    DataFilterDocsExampleComponent,
    DataFilterIsolatedExampleComponent,
    DataFilterTestComponent,
    EdgeDetectionServiceExampleComponent,
    EventPropagationServiceExampleComponent,
    FilteringIsolatedTimeFramePickerComponent,
    FilteringTimeFramePickerComponent,
    NuiDataFilterIsolatedListComponent,
    NuiDataFilterIsolatedTableComponent,
    NuiDataFilterListComponent,
    NuiDataFilterTableComponent,
    ScrollShadowsExampleComponent,
    SearchServiceExampleComponent,
    SetFocusExampleComponent,
    WelcomePageComponent,
} from "./index";
import { RepeatWithViewportManagerExampleComponent } from "./viewport-manager/repeat-with-viewport-manager/repeat-with-viewport-manager.example.component";
import { VirtualViewportManagerDocsComponent } from "./viewport-manager/virtual-viewport-manager-docs/virtual-viewport-manager-docs.component";

const routes = [
    {
        path: "", redirectTo: "welcome", pathMatch: "full",
    },
    {
        path: "clipboard",
        component: ClipboardExampleComponent,
    },
    {
        path: "data-source-client-side-filtering",
        component: DataSourceClientSideFilteringExampleComponent,
    },
    {
        path: "data-source-client-side-filtering-with-selection",
        component: DataSourceWithSelectionExampleComponent,
    },
    {
        path: "edge-detection-service",
        component: EdgeDetectionServiceExampleComponent,
    },
    {
        path: "event-propagation-service",
        component: EventPropagationServiceExampleComponent,
    },
    {
        path: "scroll-shadows",
        component: ScrollShadowsExampleComponent,
    },
    {
        path: "search-service",
        component: SearchServiceExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "set-focus",
        component: SetFocusExampleComponent,
    },
    {
        path: "data-source-service",
        loadChildren: () => import("./data-source/data-source.module").then(m => m.DataSourceModule),
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "data-filter-service",
        component: DataFilterDocsExampleComponent,
        data: {
            showThemeSwitcher: true,
        },
    },
    {
        path: "virtual-viewport-manager",
        component: VirtualViewportManagerDocsComponent,
        data: {
            showThemeSwitcher: true,
            "srlc": {
                "stage": SrlcStage.beta,
            },
        },
    },
    {
        path: "data-filter-service-test",
        component: DataFilterTestComponent,
    },
    {
        path: "badge",
        loadChildren: () => import("./badge/badge.module").then(m => m.BadgeModule),
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "tag",
        loadChildren: () => import("./tag/tag.module").then(m => m.TagModule),
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "tree",
        loadChildren: () => import("./tree/tree.module").then(m => m.TreeModule),
    },
    {
        path: "welcome", component: WelcomePageComponent,
    },
    {
        path: "unit-conversion-service",
        loadChildren: () => import("./unit-conversion-service/unit-conversion-service-example.module").then(m => m.UnitConversionServiceExampleModule),
    },
];

@NgModule({
    imports: [
        NuiDocsModule,
        DataSourceModule,
        DragDropModule,
        NuiButtonModule,
        NuiMessageModule,
        NuiRadioModule,
        NuiDividerModule,
        NuiCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        NuiIconModule,
        NuiTextboxModule,
        NuiPaginatorModule,
        NuiRepeatModule,
        NuiSearchModule,
        NuiSelectorModule,
        NuiSorterModule,
        NuiExpanderModule,
        NuiPanelModule,
        NuiPopoverModule,
        NuiSelectV2Module,
        NuiOverlayModule,
        NuiTableModule,
        NuiTimeFramePickerModule,
        RouterModule.forChild(routes),
        NuiCommonModule,
        NuiProgressModule,
    ],
    declarations: [
        ClipboardExampleComponent,
        DataFilterDocsExampleComponent,
        DataFilterBasicExampleComponent,
        DataFilterIsolatedExampleComponent,
        DataFilterTestComponent,
        NuiDataFilterListComponent,
        NuiDataFilterTableComponent,
        NuiDataFilterIsolatedListComponent,
        NuiDataFilterIsolatedTableComponent,
        EdgeDetectionServiceExampleComponent,
        EventPropagationServiceExampleComponent,
        FilteringTimeFramePickerComponent,
        FilteringIsolatedTimeFramePickerComponent,
        ScrollShadowsExampleComponent,
        SearchServiceExampleComponent,
        SetFocusExampleComponent,
        WelcomePageComponent,
        VirtualViewportManagerDocsComponent,
        RepeatWithViewportManagerExampleComponent,
    ],
    providers: [
        DatePipe,
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/),
        },
    ],
    exports: [
        RouterModule,
    ],
})
export class CommonModule {
}
