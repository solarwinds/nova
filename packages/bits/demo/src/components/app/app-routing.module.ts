import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// To use polyfill you need to create an instance of it
// const i18n = new I18n("xlf", translationLibrary, "fr");
// And then data: i18n("Some string");

const appRoutes: Routes = [
    {
        path: "static",
        loadChildren: () => import("../../../src/static/static-example.module").then(m => m.StaticExampleModule),
    },
    {
        path: "schematics",
        loadChildren: () => import("../../../src/schematics/schematic.module").then(m => m.SchematicModule),
    },
    {
        path: "breadcrumb",
        loadChildren: () => import("../demo/breadcrumb/breadcrumb.module").then(m => m.BreadcrumbModule),
    },
    {
        path: "busy",
        loadChildren: () => import("../demo/busy/busy.module").then(m => m.BusyModule),
    },
    {
        path: "button",
        loadChildren: () => import("../demo/button/button.module").then(m => m.ButtonModule),
    },
    {
        path: "checkbox",
        loadChildren: () => import("../demo/checkbox/checkbox.module").then(m => m.CheckboxModule),
    },
    {
        path: "checkbox-group",
        loadChildren: () => import("../demo/checkbox-group/checkbox-group.module").then(m => m.CheckboxGroupModule),
    },
    {
        path: "chips",
        loadChildren: () => import("../demo/chips/chips.module").then(m => m.ChipsModule),
    },
    {
        path: "combobox",
        loadChildren: () => import("../demo/combobox/combobox.module").then(m => m.ComboboxModule),
    },
    {
        path: "combobox-v2",
        loadChildren: () => import("../demo/combobox-v2/combobox-v2.module").then(m => m.ComboboxV2Module),
    },
    {
        path: "common",
        loadChildren: () => import("../demo/common/common.module").then(m => m.CommonModule),
    },
    {
        path: "content",
        loadChildren: () => import("../demo/content/content.module").then(m => m.ContentModule),

    },
    {
        path: "convenience",
        loadChildren: () => import("../demo/convenience/convenience.module").then(m => m.ConvenienceModule),
    },
    {
        path: "date-picker",
        loadChildren: () => import("../demo/date-picker/date-picker.module").then(m => m.DatePickerModule),
    },
    {
        path: "date-time-picker",
        loadChildren: () => import("../demo/date-time-picker/date-time-picker.module").then(m => m.DateTimePickerModule),
    },
    {
        path: "divider",
        loadChildren: () => import("../demo/divider/divider.module").then(m => m.DividerModule),
    },
    {
        path: "dialog",
        loadChildren: () => import("../demo/dialog/dialog.module").then(m => m.DialogModule),
    },
    {
        path: "dragdrop",
        loadChildren: () => import("../demo/dragdrop/dragdrop.module").then(m => m.DragDropDemoModule),
    },
    {
        path: "dragdrop-cdk",
        loadChildren: () => import("../demo/dragdrop-cdk/dragdrop.module").then(m => m.DragDropCdkDemoModule),
    },
    {
        path: "expander",
        loadChildren: () => import("../demo/expander/expander.module").then(m => m.ExpanderModule),
    },
    {
        path: "external-libraries",
        loadChildren: () => import("../demo/external-libraries/external-libraries.module").then(m => m.ExternalLibrariesModule),
    },
    {
        path: "form-field",
        loadChildren: () => import("../demo/form-field/form-field.module").then(m => m.FormFieldModule),
    },
    {
        path: "highlight",
        loadChildren: () => import("../demo/highlight/highlight.module").then(m => m.HighlightModule),
    },
    {
        path: "icon",
        loadChildren: () => import("../demo/icon/icon.module").then(m => m.IconModule),
    },
    {
        path: "layout",
        loadChildren: () => import("../demo/layout/layout.module").then(m => m.LayoutModule),
    },
    {
        path: "menu",
        loadChildren: () => import("../demo/menu/menu.module").then(m => m.MenuModule),
    },
    {
        path: "message",
        loadChildren: () => import("../demo/message/message.module").then(m => m.MessageModule),
    },
    {
        path: "paginator",
        loadChildren: () => import("../demo/paginator/paginator.module").then(m => m.PaginatorModule),
    },
    {
        path: "panel",
        loadChildren: () => import("../demo/panel/panel.module").then(m => m.PanelModule),
    },
    {
        path: "pipes",
        loadChildren: () => import("../demo/pipes/pipes.module").then(m => m.PipesModule),
    },
    {
        path: "popover",
        loadChildren: () => import("../demo/popover/popover.module").then(m => m.PopoverModule),
    },
    {
        path: "popup",
        loadChildren: () => import("../demo/popup/popup.module").then(m => m.PopupModule),
    },
    {
        path: "overlay",
        loadChildren: () => import("../demo/overlay/overlay.module").then(m => m.OverlayModule),
    },
    {
        path: "progress",
        loadChildren: () => import("../demo/progress/progress.module").then(m => m.ProgressModule),
    },
    {
        path: "radio-group",
        loadChildren: () => import("../demo/radio-group/radio-group.module").then(m => m.RadioGroupModule),
    },
    {
        path: "repeat",
        loadChildren: () => import("../demo/repeat/repeat.module").then(m => m.RepeatModule),
    },
    {
        path: "resizer",
        loadChildren: () => import("../demo/resize/resize.module").then(m => m.ResizeModule),
    },
    {
        path: "search",
        loadChildren: () => import("../demo/search/search.module").then(m => m.SearchModule),
    },
    {
        path: "select",
        loadChildren: () => import("../demo/select/select.module").then(m => m.SelectModule),
    },
    {
        path: "select-v2",
        loadChildren: () => import("../demo/select-v2/select-v2.module").then(m => m.SelectV2Module),
    },
    {
        path: "selector",
        loadChildren: () => import("../demo/selector/selector.module").then(m => m.SelectorModule),
    },
    {
        path: "spinner",
        loadChildren: () => import("../demo/spinner/spinner.module").then(m => m.SpinnerModule),
    },
    {
        path: "sorter",
        loadChildren: () => import("../demo/sorter/sorter.module").then(m => m.SorterModule),
    },
    {
        path: "switch",
        loadChildren: () => import("../demo/switch/switch.module").then(m => m.SwitchModule),
    },
    {
        path: "tabgroup",
        loadChildren: () => import("../demo/tabgroup/tabgroup.module").then(m => m.TabgroupModule),
    },
    {
        path: "table",
        loadChildren: () => import("../demo/table/table.module").then(m => m.TableModule),
    },
    {
        path: "textbox",
        loadChildren: () => import("../demo/textbox/textbox.module").then(m => m.TextboxModule),
    },
    {
        path: "theming",
        loadChildren: () => import("../demo/theming/theming.module").then(m => m.ThemingModule),
    },
    {
        path: "time-picker",
        loadChildren: () => import("../demo/time-picker/time-picker.module").then(m => m.TimePickerModule),
    },
    {
        path: "time-frame-picker",
        loadChildren: () => import("../demo/time-frame-picker/time-frame-picker.module").then(m => m.TimeFramePickerModule),
    },
    {
        path: "toast",
        loadChildren: () => import("../demo/toast/toast.module").then(m => m.ToastModule),
    },
    {
        path: "toolbar",
        loadChildren: () => import("../demo/toolbar/toolbar.module").then(m => m.ToolbarModule),
    },
    {
        path: "tooltip",
        loadChildren: () => import("../demo/tooltip/tooltip.module").then(m => m.TooltipDemoModule),
    },
    {
        path: "wizard",
        loadChildren: () => import("../demo/wizard/wizard.module").then(m => m.WizardModule),
    },
    {
        path: "", redirectTo: "common", pathMatch: "full",
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { useHash: true }),
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRoutingModule {
}
