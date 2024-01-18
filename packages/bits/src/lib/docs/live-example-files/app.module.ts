export const APP_MODULE = (
    filenamePrefix: string,
    context: string,
    imports: string,
    mainComponentName: string,
    componentNames: string,
    customRoutes: boolean,
    chartsImport?: boolean,
    dashboardsImport?: boolean
): string =>
    "import { BrowserModule } from \"@angular/platform-browser\";\n" +
    "import { BrowserAnimationsModule } from '@angular/platform-browser/animations';\n" +
    "import { FormsModule, ReactiveFormsModule } from '@angular/forms';\n" +
    "import { HttpClientModule } from '@angular/common/http';\n" +
    "import { NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from \"@angular/core\";\n" +
    "import { RouterModule } from \"@angular/router\";\n" +
    "import { AppComponent } from \"./app.component\";\n" +
    `${customRoutes ? "import { ROUTES } from \"./routes\";" : ""}\n` +
    "import {\n" +
    "    NuiButtonModule,\n" +
    "    NuiCheckboxModule,\n" +
    "    NuiCommonModule,\n" +
    "    NuiDividerModule,\n" +
    "    NuiIconModule,\n" +
    "    NuiMessageModule,\n" +
    "    NuiImageModule,\n" +
    "    NuiMenuModule,\n" +
    "    NuiPopupModule,\n" +
    "    NuiSwitchModule,\n" +
    "    NuiSelectModule,\n" +
    "    NuiSelectV2Module,\n" +
    "    NuiSpinnerModule,\n" +
    "    NuiTabsModule,\n" +
    "    NuiTextboxModule,\n" +
    "    NuiTooltipModule,\n" +
    "    NuiLayoutModule,\n" +
    "    NuiOverlayModule,\n" +
    "    NuiOverlayAdditionsModule,\n" +
    "    NuiBreadcrumbModule,\n" +
    "    NuiBusyModule,\n" +
    "    NuiChipsModule,\n" +
    "    NuiContentModule,\n" +
    "    NuiDatePickerModule,\n" +
    "    NuiDateTimePickerModule,\n" +
    "    NuiDialogModule,\n" +
    "    NuiExpanderModule,\n" +
    "    NuiFormFieldModule,\n" +
    "    NuiPaginatorModule,\n" +
    "    NuiPanelModule,\n" +
    "    NuiPopoverModule,\n" +
    "    NuiProgressModule,\n" +
    "    NuiRadioModule,\n" +
    "    NuiRepeatModule,\n" +
    "    NuiSearchModule,\n" +
    "    NuiSelectorModule,\n" +
    "    NuiSorterModule,\n" +
    "    NuiTableModule,\n" +
    "    NuiTimeFrameBarModule,\n" +
    "    NuiTimeFramePickerModule,\n" +
    "    NuiTimePickerModule,\n" +
    "    NuiToastModule,\n" +
    "    NuiToolbarModule,\n" +
    "    NuiValidationMessageModule,\n" +
    "    NuiWizardModule,\n" +
    "    NuiWizardV2Module,\n" +
    "} from '@nova-ui/bits';\n" +
    `${
        chartsImport
            ? "import { NuiChartsModule } from \"@nova-ui/charts\";\n"
            : ""
    }` +
    "\n" +
    `${
        dashboardsImport
            ? "import { NuiDashboardsModule } from \"@nova-ui/dashboards\";\n"
            : ""
    }` +
    "\n" +
    `${imports}\n` +
    "\n" +
    "@NgModule({\n" +
    `    declarations: [AppComponent, ${componentNames}],\n` +
    "    imports: [\n" +
    "        BrowserModule,\n" +
    "        BrowserModule,\n" +
    "        BrowserAnimationsModule,\n" +
    "        FormsModule,\n" +
    "        ReactiveFormsModule,\n" +
    "        HttpClientModule,\n" +
    "        NuiButtonModule,\n" +
    "        NuiCheckboxModule,\n" +
    "        NuiCommonModule,\n" +
    "        NuiDividerModule,\n" +
    "        NuiIconModule,\n" +
    "        NuiMessageModule,\n" +
    "        NuiImageModule,\n" +
    "        NuiMenuModule,\n" +
    "        NuiPopupModule,\n" +
    "        NuiSwitchModule,\n" +
    "        NuiSelectModule,\n" +
    "        NuiSelectV2Module,\n" +
    "        NuiSpinnerModule,\n" +
    "        NuiTabsModule,\n" +
    "        NuiTextboxModule,\n" +
    "        NuiTooltipModule,\n" +
    "        NuiLayoutModule,\n" +
    "        NuiOverlayModule,\n" +
    "        NuiOverlayAdditionsModule,\n" +
    "        NuiBreadcrumbModule,\n" +
    "        NuiBusyModule,\n" +
    "        NuiChipsModule,\n" +
    "        NuiContentModule,\n" +
    "        NuiDatePickerModule,\n" +
    "        NuiDateTimePickerModule,\n" +
    "        NuiDialogModule,\n" +
    "        NuiExpanderModule,\n" +
    "        NuiFormFieldModule,\n" +
    "        NuiPaginatorModule,\n" +
    "        NuiPanelModule,\n" +
    "        NuiPopoverModule,\n" +
    "        NuiProgressModule,\n" +
    "        NuiRadioModule,\n" +
    "        NuiRepeatModule,\n" +
    "        NuiSearchModule,\n" +
    "        NuiSelectorModule,\n" +
    "        NuiSorterModule,\n" +
    "        NuiTableModule,\n" +
    "        NuiTimeFrameBarModule,\n" +
    "        NuiTimeFramePickerModule,\n" +
    "        NuiTimePickerModule,\n" +
    "        NuiToastModule,\n" +
    "        NuiToolbarModule,\n" +
    "        NuiValidationMessageModule,\n" +
    "        NuiWizardModule,\n" +
    "        NuiWizardV2Module,\n" +
    `${chartsImport ? "        NuiChartsModule," : ""}` +
    `${dashboardsImport ? "        NuiDashboardsModule," : ""}` +
    `        RouterModule.forRoot(${
        customRoutes
            ? getCustomRoute(context)
            : getDefaultRoute(context, mainComponentName)
    })\n` +
    "    ],\n" +
    "    providers: [\n" +
    "        { provide: TRANSLATIONS_FORMAT, useValue: \"xlf\" },\n" +
    "        { provide: TRANSLATIONS, useValue: \"\" }\n" +
    "    ],\n" +
    "    bootstrap: [AppComponent]\n" +
    "})\n" +
    "export class AppModule {}\n";

const getDefaultRoute = (
    context: string,
    mainComponentName: string
): string => (
        `[{path: "", redirectTo: "${context}",pathMatch: "full"},\n` +
        `{path: "${context}", component: ${mainComponentName} }]`
    );

const getCustomRoute = (context: string): string => (
        `[{path: "", redirectTo: "${context}",pathMatch: "full"},\n` +
        `{path: "${context}", children: ROUTES }]`
    );
