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
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

// To use polyfill you need to create an instance of it
// const i18n = new I18n("xlf", translationLibrary, "fr");
// And then data: i18n("Some string");

const appRoutes: Routes = [
    {
        path: "static",
        loadChildren: async () =>
            import("../../../src/static/static-example.module"),
    },
    {
        path: "schematics",
        loadChildren: async () =>
            import("../../../src/schematics/schematic.module"),
    },
    {
        path: "breadcrumb",
        loadChildren: async () =>
            import("../demo/breadcrumb/breadcrumb.module"),
    },
    {
        path: "busy",
        loadChildren: async () => import("../demo/busy/busy.module"),
    },
    {
        path: "button",
        loadChildren: async () => import("../demo/button/button.module"),
    },
    {
        path: "checkbox",
        loadChildren: async () => import("../demo/checkbox/checkbox.module"),
    },
    {
        path: "checkbox-group",
        loadChildren: async () =>
            import("../demo/checkbox-group/checkbox-group.module"),
    },
    {
        path: "chips",
        loadChildren: async () => import("../demo/chips/chips.module"),
    },
    {
        path: "combobox",
        loadChildren: async () => import("../demo/combobox/combobox.module"),
    },
    {
        path: "combobox-v2",
        loadChildren: async () =>
            import("../demo/combobox-v2/combobox-v2.module"),
    },
    {
        path: "common",
        loadChildren: async () => import("../demo/common/common.module"),
    },
    {
        path: "content",
        loadChildren: async () => import("../demo/content/content.module"),
    },
    {
        path: "convenience",
        loadChildren: async () =>
            import("../demo/convenience/convenience.module"),
    },
    {
        path: "date-picker",
        loadChildren: async () =>
            import("../demo/date-picker/date-picker.module"),
    },
    {
        path: "date-time-picker",
        loadChildren: async () =>
            import("../demo/date-time-picker/date-time-picker.module"),
    },
    {
        path: "divider",
        loadChildren: async () => import("../demo/divider/divider.module"),
    },
    {
        path: "dialog",
        loadChildren: async () => import("../demo/dialog/dialog.module"),
    },
    {
        path: "dragdrop",
        loadChildren: async () => import("../demo/dragdrop/dragdrop.module"),
    },
    {
        path: "dragdrop-cdk",
        loadChildren: async () =>
            import("../demo/dragdrop-cdk/dragdrop.module"),
    },
    {
        path: "expander",
        loadChildren: async () => import("../demo/expander/expander.module"),
    },
    {
        path: "external-libraries",
        loadChildren: async () =>
            import("../demo/external-libraries/external-libraries.module"),
    },
    {
        path: "form-field",
        loadChildren: async () =>
            import("../demo/form-field/form-field.module"),
    },
    {
        path: "highlight",
        loadChildren: async () => import("../demo/highlight/highlight.module"),
    },
    {
        path: "icon",
        loadChildren: async () => import("../demo/icon/icon.module"),
    },
    {
        path: "image",
        loadChildren: async () => import("../demo/image/image.module"),
    },
    {
        path: "layout",
        loadChildren: async () => import("../demo/layout/layout.module"),
    },
    {
        path: "menu",
        loadChildren: async () => import("../demo/menu/menu.module"),
    },
    {
        path: "message",
        loadChildren: async () => import("../demo/message/message.module"),
    },
    {
        path: "paginator",
        loadChildren: async () => import("../demo/paginator/paginator.module"),
    },
    {
        path: "panel",
        loadChildren: async () => import("../demo/panel/panel.module"),
    },
    {
        path: "pipes",
        loadChildren: async () => import("../demo/pipes/pipes.module"),
    },
    {
        path: "popover",
        loadChildren: async () => import("../demo/popover/popover.module"),
    },
    {
        path: "popup",
        loadChildren: async () => import("../demo/popup/popup.module"),
    },
    {
        path: "overlay",
        loadChildren: async () => import("../demo/overlay/overlay.module"),
    },
    {
        path: "progress",
        loadChildren: async () => import("../demo/progress/progress.module"),
    },
    {
        path: "radio-group",
        loadChildren: async () =>
            import("../demo/radio-group/radio-group.module"),
    },
    {
        path: "repeat",
        loadChildren: async () => import("../demo/repeat/repeat.module"),
    },
    {
        path: "resizer",
        loadChildren: async () => import("../demo/resize/resize.module"),
    },
    {
        path: "runtime-i18n",
        loadChildren: async () =>
            import("../demo/runtime-i18n/runtime-i18n.module"),
    },
    {
        path: "search",
        loadChildren: async () => import("../demo/search/search.module"),
    },
    {
        path: "select",
        loadChildren: async () => import("../demo/select/select.module"),
    },
    {
        path: "select-v2",
        loadChildren: async () => import("../demo/select-v2/select-v2.module"),
    },
    {
        path: "selector",
        loadChildren: async () => import("../demo/selector/selector.module"),
    },
    {
        path: "spinner",
        loadChildren: async () => import("../demo/spinner/spinner.module"),
    },
    {
        path: "sorter",
        loadChildren: async () => import("../demo/sorter/sorter.module"),
    },
    {
        path: "switch",
        loadChildren: async () => import("../demo/switch/switch.module"),
    },
    {
        path: "tabgroup",
        loadChildren: async () => import("../demo/tabgroup/tabgroup.module"),
    },
    {
        path: "table",
        loadChildren: async () => import("../demo/table/table.module"),
    },
    {
        path: "textbox",
        loadChildren: async () => import("../demo/textbox/textbox.module"),
    },
    {
        path: "theming",
        loadChildren: async () => import("../demo/theming/theming.module"),
    },
    {
        path: "time-picker",
        loadChildren: async () =>
            import("../demo/time-picker/time-picker.module"),
    },
    {
        path: "time-frame-picker",
        loadChildren: async () =>
            import("../demo/time-frame-picker/time-frame-picker.module"),
    },
    {
        path: "toast",
        loadChildren: async () => import("../demo/toast/toast.module"),
    },
    {
        path: "toolbar",
        loadChildren: async () => import("../demo/toolbar/toolbar.module"),
    },
    {
        path: "tooltip",
        loadChildren: async () => import("../demo/tooltip/tooltip.module"),
    },
    {
        path: "wizard",
        loadChildren: async () => import("../demo/wizard/wizard.module"),
    },
    {
        path: "wizard-v2",
        loadChildren: async () => import("../demo/wizard-v2/wizard-v2.module"),
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
            preloadingStrategy: PreloadAllModules,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
