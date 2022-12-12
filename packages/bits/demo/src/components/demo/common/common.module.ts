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

import { DragDropModule } from "@angular/cdk/drag-drop";
import { DatePipe } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import {
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

import { DataSourceClientSideFilteringExampleComponent } from "./data-source/client-side/client-side-filtering/client-side-filtering.example.component";
import { DataSourceWithSelectionExampleComponent } from "./data-source/client-side/client-side-with-selection/client-side-with-selection.example.component";
import { DataSourceModule } from "./data-source/data-source.module";
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

const routes: Routes = [
    {
        path: "",
        redirectTo: "welcome",
        pathMatch: "full",
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
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "set-focus",
        component: SetFocusExampleComponent,
    },
    {
        path: "data-source-service",
        loadChildren: async () =>
            import("./data-source/data-source.module").then(
                (m) => m.DataSourceModule
            ) as Promise<any>,
        data: {
            srlc: {
                stage: SrlcStage.ga,
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
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
    {
        path: "data-filter-service-test",
        component: DataFilterTestComponent,
    },
    {
        path: "badge",
        loadChildren: async () =>
            import("./badge/badge.module").then(
                (m) => m.BadgeModule
            ) as Promise<any>,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "tag",
        loadChildren: async () =>
            import("./tag/tag.module").then((m) => m.TagModule) as Promise<any>,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "tree",
        loadChildren: async () =>
            import("./tree/tree.module").then((m) => m.TreeModule) as Promise<
                Type<any>
            >,
    },
    {
        path: "welcome",
        component: WelcomePageComponent,
    },
    {
        path: "unit-conversion-service",
        loadChildren: async () =>
            import(
                "./unit-conversion-service/unit-conversion-service-example.module"
            ).then((m) => m.UnitConversionServiceExampleModule) as Promise<
                Type<any>
            >,
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
    providers: [DatePipe],
    exports: [RouterModule],
})
export default class CommonModule {}
