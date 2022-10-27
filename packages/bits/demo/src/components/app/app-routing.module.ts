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

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// To use polyfill you need to create an instance of it
// const i18n = new I18n("xlf", translationLibrary, "fr");
// And then data: i18n("Some string");

const appRoutes: Routes = [
    {
        path: "static",
        loadChildren: async () =>
            import("../../../src/static/static-example.module").then(
                (m) => m.StaticExampleModule
            ),
    },
    {
        path: "schematics",
        loadChildren: async () =>
            import("../../../src/schematics/schematic.module").then(
                (m) => m.SchematicModule
            ),
    },
    {
        path: "breadcrumb",
        loadChildren: async () =>
            import("../demo/breadcrumb/breadcrumb.module").then(
                (m) => m.BreadcrumbModule
            ),
    },
    {
        path: "busy",
        loadChildren: async () =>
            import("../demo/busy/busy.module").then((m) => m.BusyModule),
    },
    {
        path: "button",
        loadChildren: async () =>
            import("../demo/button/button.module").then((m) => m.ButtonModule),
    },
    {
        path: "checkbox",
        loadChildren: async () =>
            import("../demo/checkbox/checkbox.module").then(
                (m) => m.CheckboxModule
            ),
    },
    {
        path: "checkbox-group",
        loadChildren: async () =>
            import("../demo/checkbox-group/checkbox-group.module").then(
                (m) => m.CheckboxGroupModule
            ),
    },
    {
        path: "chips",
        loadChildren: async () =>
            import("../demo/chips/chips.module").then((m) => m.ChipsModule),
    },
    {
        path: "combobox",
        loadChildren: async () =>
            import("../demo/combobox/combobox.module").then(
                (m) => m.ComboboxModule
            ),
    },
    {
        path: "combobox-v2",
        loadChildren: async () =>
            import("../demo/combobox-v2/combobox-v2.module").then(
                (m) => m.ComboboxV2Module
            ),
    },
    {
        path: "common",
        loadChildren: async () =>
            import("../demo/common/common.module").then((m) => m.CommonModule),
    },
    {
        path: "content",
        loadChildren: async () =>
            import("../demo/content/content.module").then(
                (m) => m.ContentModule
            ),
    },
    {
        path: "convenience",
        loadChildren: async () =>
            import("../demo/convenience/convenience.module").then(
                (m) => m.ConvenienceModule
            ),
    },
    {
        path: "date-picker",
        loadChildren: async () =>
            import("../demo/date-picker/date-picker.module").then(
                (m) => m.DatePickerModule
            ),
    },
    {
        path: "date-time-picker",
        loadChildren: async () =>
            import("../demo/date-time-picker/date-time-picker.module").then(
                (m) => m.DateTimePickerModule
            ),
    },
    {
        path: "divider",
        loadChildren: async () =>
            import("../demo/divider/divider.module").then(
                (m) => m.DividerModule
            ),
    },
    {
        path: "dialog",
        loadChildren: async () =>
            import("../demo/dialog/dialog.module").then((m) => m.DialogModule),
    },
    {
        path: "dragdrop",
        loadChildren: async () =>
            import("../demo/dragdrop/dragdrop.module").then(
                (m) => m.DragDropDemoModule
            ),
    },
    {
        path: "dragdrop-cdk",
        loadChildren: async () =>
            import("../demo/dragdrop-cdk/dragdrop.module").then(
                (m) => m.DragDropCdkDemoModule
            ),
    },
    {
        path: "expander",
        loadChildren: async () =>
            import("../demo/expander/expander.module").then(
                (m) => m.ExpanderModule
            ),
    },
    {
        path: "external-libraries",
        loadChildren: async () =>
            import("../demo/external-libraries/external-libraries.module").then(
                (m) => m.ExternalLibrariesModule
            ),
    },
    {
        path: "form-field",
        loadChildren: async () =>
            import("../demo/form-field/form-field.module").then(
                (m) => m.FormFieldModule
            ),
    },
    {
        path: "highlight",
        loadChildren: async () =>
            import("../demo/highlight/highlight.module").then(
                (m) => m.HighlightModule
            ),
    },
    {
        path: "icon",
        loadChildren: async () =>
            import("../demo/icon/icon.module").then((m) => m.IconModule),
    },
    {
        path: "image",
        loadChildren: async () =>
            import("../demo/image/image.module").then((m) => m.ImageModule),
    },
    {
        path: "layout",
        loadChildren: async () =>
            import("../demo/layout/layout.module").then((m) => m.LayoutModule),
    },
    {
        path: "menu",
        loadChildren: async () =>
            import("../demo/menu/menu.module").then((m) => m.MenuModule),
    },
    {
        path: "message",
        loadChildren: async () =>
            import("../demo/message/message.module").then(
                (m) => m.MessageModule
            ),
    },
    {
        path: "paginator",
        loadChildren: async () =>
            import("../demo/paginator/paginator.module").then(
                (m) => m.PaginatorModule
            ),
    },
    {
        path: "panel",
        loadChildren: async () =>
            import("../demo/panel/panel.module").then((m) => m.PanelModule),
    },
    {
        path: "pipes",
        loadChildren: async () =>
            import("../demo/pipes/pipes.module").then((m) => m.PipesModule),
    },
    {
        path: "popover",
        loadChildren: async () =>
            import("../demo/popover/popover.module").then(
                (m) => m.PopoverModule
            ),
    },
    {
        path: "popup",
        loadChildren: async () =>
            import("../demo/popup/popup.module").then((m) => m.PopupModule),
    },
    {
        path: "overlay",
        loadChildren: async () =>
            import("../demo/overlay/overlay.module").then(
                (m) => m.OverlayModule
            ),
    },
    {
        path: "progress",
        loadChildren: async () =>
            import("../demo/progress/progress.module").then(
                (m) => m.ProgressModule
            ),
    },
    {
        path: "radio-group",
        loadChildren: async () =>
            import("../demo/radio-group/radio-group.module").then(
                (m) => m.RadioGroupModule
            ),
    },
    {
        path: "repeat",
        loadChildren: async () =>
            import("../demo/repeat/repeat.module").then((m) => m.RepeatModule),
    },
    {
        path: "resizer",
        loadChildren: async () =>
            import("../demo/resize/resize.module").then((m) => m.ResizeModule),
    },
    {
        path: "runtime-i18n",
        loadChildren: async () =>
            import("../demo/runtime-i18n/runtime-i18n.module").then(
                (m) => m.RuntimeI18NModule
            ),
    },
    {
        path: "search",
        loadChildren: async () =>
            import("../demo/search/search.module").then((m) => m.SearchModule),
    },
    {
        path: "select",
        loadChildren: async () =>
            import("../demo/select/select.module").then((m) => m.SelectModule),
    },
    {
        path: "select-v2",
        loadChildren: async () =>
            import("../demo/select-v2/select-v2.module").then(
                (m) => m.SelectV2Module
            ),
    },
    {
        path: "selector",
        loadChildren: async () =>
            import("../demo/selector/selector.module").then(
                (m) => m.SelectorModule
            ),
    },
    {
        path: "spinner",
        loadChildren: async () =>
            import("../demo/spinner/spinner.module").then(
                (m) => m.SpinnerModule
            ),
    },
    {
        path: "sorter",
        loadChildren: async () =>
            import("../demo/sorter/sorter.module").then((m) => m.SorterModule),
    },
    {
        path: "switch",
        loadChildren: async () =>
            import("../demo/switch/switch.module").then((m) => m.SwitchModule),
    },
    {
        path: "tabgroup",
        loadChildren: async () =>
            import("../demo/tabgroup/tabgroup.module").then(
                (m) => m.TabgroupModule
            ),
    },
    {
        path: "table",
        loadChildren: async () =>
            import("../demo/table/table.module").then((m) => m.TableModule),
    },
    {
        path: "textbox",
        loadChildren: async () =>
            import("../demo/textbox/textbox.module").then(
                (m) => m.TextboxModule
            ),
    },
    {
        path: "theming",
        loadChildren: async () =>
            import("../demo/theming/theming.module").then(
                (m) => m.ThemingModule
            ),
    },
    {
        path: "time-picker",
        loadChildren: async () =>
            import("../demo/time-picker/time-picker.module").then(
                (m) => m.TimePickerModule
            ),
    },
    {
        path: "time-frame-picker",
        loadChildren: async () =>
            import("../demo/time-frame-picker/time-frame-picker.module").then(
                (m) => m.TimeFramePickerModule
            ),
    },
    {
        path: "toast",
        loadChildren: async () =>
            import("../demo/toast/toast.module").then((m) => m.ToastModule),
    },
    {
        path: "toolbar",
        loadChildren: async () =>
            import("../demo/toolbar/toolbar.module").then(
                (m) => m.ToolbarModule
            ),
    },
    {
        path: "tooltip",
        loadChildren: async () =>
            import("../demo/tooltip/tooltip.module").then(
                (m) => m.TooltipDemoModule
            ),
    },
    {
        path: "wizard",
        loadChildren: async () =>
            import("../demo/wizard/wizard.module").then((m) => m.WizardModule),
    },
    {
        path: "wizard-v2",
        loadChildren: async () =>
            import("../demo/wizard-v2/wizard-v2.module").then(
                (m) => m.WizardV2Module
            ),
    },
    {
        path: "",
        redirectTo: "common",
        pathMatch: "full",
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            useHash: true,
            relativeLinkResolution: "legacy",
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
