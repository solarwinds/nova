import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class PlunkerFiles {
    public getAppFile = (filePrefix: string, className: string, selector: string): string => `import {
    Component,
    NgModule,
    TRANSLATIONS,
    TRANSLATIONS_FORMAT
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import '@angular/localize';

// Note: It's likely that most of these modules imported from Nova aren't
// necessary for your implementation. They're included here to allow Nova's
// plunker usage to work with all of the existing Nova components. If
// you're copy/pasting this code, be sure to remove the ones you don't need in
// order to avoid unnecessarily including them in your app's deployed package.
import {
    NuiButtonModule,
    NuiCheckboxModule,
    NuiCommonModule,
    NuiDividerModule,
    NuiIconModule,
    NuiMessageModule,
    NuiImageModule,
    NuiMenuModule,
    NuiPopupModule,
    NuiSwitchModule,
    NuiSelectModule,
    NuiSelectV2Module,
    NuiSpinnerModule,
    NuiTabsModule,
    NuiTextboxModule,
    NuiTooltipModule,
    NuiLayoutModule,
    NuiOverlayModule,
    NuiOverlayAdditionsModule,
    NuiBreadcrumbModule,
    NuiBusyModule,
    NuiChipsModule,
    NuiContentModule,
    NuiDatePickerModule,
    NuiDateTimePickerModule,
    NuiDialogModule,
    NuiExpanderModule,
    NuiFormFieldModule,
    NuiPaginatorModule,
    NuiPanelModule,
    NuiPopoverModule,
    NuiProgressModule,
    NuiRadioModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSelectorModule,
    NuiSorterModule,
    NuiTableModule,
    NuiTimeFrameBarModule,
    NuiTimeFramePickerModule,
    NuiTimePickerModule,
    NuiToastModule,
    NuiToolbarModule,
    NuiValidationMessageModule,
    NuiWizardModule,
    NuiWizardV2Module,
} from '@nova-ui/bits';

import { NuiChartsModule } from '@nova-ui/charts';
import { NuiDashboardsModule, NuiDashboardConfiguratorModule } from '@nova-ui/dashboards';

import { ${className} } from './${filePrefix}.component';

import { translations } from './translations';

@Component({
    selector: 'my-app',
    template: \`
    <div class="p-4">
        <h1>{{'${filePrefix}' | titlecase}} Demo</h1>
        <div>
          <${selector}></${selector}>
        </div>
    </div>\`
})
export class App {
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NuiChartsModule,
        NuiDashboardsModule,
        NuiDashboardConfiguratorModule,
        NuiButtonModule,
        NuiCheckboxModule,
        NuiCommonModule,
        NuiDividerModule,
        NuiIconModule,
        NuiMessageModule,
        NuiImageModule,
        NuiMenuModule,
        NuiPopupModule,
        NuiSwitchModule,
        NuiSelectModule,
        NuiSelectV2Module,
        NuiSpinnerModule,
        NuiTabsModule,
        NuiTextboxModule,
        NuiTooltipModule,
        NuiLayoutModule,
        NuiOverlayModule,
        NuiOverlayAdditionsModule,
        NuiBreadcrumbModule,
        NuiBusyModule,
        NuiChipsModule,
        NuiContentModule,
        NuiDatePickerModule,
        NuiDateTimePickerModule,
        NuiDialogModule,
        NuiExpanderModule,
        NuiFormFieldModule,
        NuiPaginatorModule,
        NuiPanelModule,
        NuiPopoverModule,
        NuiProgressModule,
        NuiRadioModule,
        NuiRepeatModule,
        NuiSearchModule,
        NuiSelectorModule,
        NuiSorterModule,
        NuiTableModule,
        NuiTimeFrameBarModule,
        NuiTimeFramePickerModule,
        NuiTimePickerModule,
        NuiToastModule,
        NuiToolbarModule,
        NuiValidationMessageModule,
        NuiWizardModule,
        NuiWizardV2Module,
    ],
    declarations: [App, ${className}],
    bootstrap: [App],
    providers: [
        { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
        { provide: TRANSLATIONS, useValue: translations },
    ],
})
export class AppModule {}
`

    public getSystemJsConfigFile = (): string => `var ver = {
    ng: '^11.0.0'
};

System.config({
    //use typescript for compilation
    transpiler: 'typescript',
    //typescript compiler options
    typescriptOptions: {
        emitDecoratorMetadata: true,
        "allowSyntheticDefaultImports": true
    },
    meta: {
        'typescript': {
            "exports": "ts"
        }
    },
    paths: {
        'npm:': 'https://unpkg.com/'
    },
    map: {

        'app': '.',

        '@angular/animations': 'npm:@angular/animations@' + ver.ng + '',
        '@angular/core': 'npm:@angular/core@' + ver.ng + '/bundles/core.umd.js',
        '@angular/common': 'npm:@angular/common@' + ver.ng + '/bundles/common.umd.js',
        '@angular/common/http': 'npm:@angular/common@' + ver.ng + '/bundles/common-http.umd.js',
        '@angular/compiler': 'npm:@angular/compiler@' + ver.ng + '/bundles/compiler.umd.js',
        '@angular/platform-browser': 'npm:@angular/platform-browser@' + ver.ng + '',
        '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@' + ver.ng + '/bundles/platform-browser-dynamic.umd.js',
        '@angular/http': 'npm:@angular/http@' + ver.ng + '/bundles/http.umd.js',
        '@angular/router': 'npm:@angular/router@' + ver.ng + '/bundles/router.umd.js',
        '@angular/forms': 'npm:@angular/forms@' + ver.ng + '/bundles/forms.umd.js',
        '@angular/localize': 'npm:@angular/localize@' + ver.ng + '/bundles/localize-init.umd.js',

        '@angular/cdk/a11y': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-a11y.umd.js',
        '@angular/cdk/scrolling': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-scrolling.umd.js',
        '@angular/cdk/collections': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-collections.umd.js',
        '@angular/cdk/table': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-table.umd.js',
        '@angular/cdk/bidi': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-bidi.umd.js',
        '@angular/cdk/platform': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-platform.umd.js',
        '@angular/cdk/keycodes': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-keycodes.umd.js',
        '@angular/cdk/coercion': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-coercion.umd.js',
        '@angular/cdk/observers': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-observers.umd.js',
        '@angular/cdk/overlay': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-overlay.umd.js',
        '@angular/cdk/portal': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-portal.umd.js',
        '@angular/cdk/drag-drop': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-drag-drop.umd.js',
        '@angular/cdk/stepper': 'npm:@angular/cdk@' + ver.ng + '/bundles/cdk-stepper.umd.js',
        'angular-gridster2': 'npm:angular-gridster2@' + ver.ng,
        'resize-observer-polyfill': 'npm:resize-observer-polyfill@1.5.1/dist/ResizeObserver.js',

        'rxjs': 'npm:rxjs@6.5.2',
        'tslib': 'npm:tslib/tslib.js',
        'typescript': 'npm:typescript@~3.8.3/lib/typescript.js',
        'moment': 'npm:moment@2.24.0/moment.js',
        'moment/moment': 'npm:moment@2.24.0/moment.js',

        'highlight.js/lib': 'npm:highlight.js@^10.6.0/lib',
        'lodash': 'npm:lodash@4.17.11',
        "lodash/assign": "npm:lodash@4.17.11/assign.js",
        "lodash/capitalize": "npm:lodash@4.17.11/capitalize.js",
        "lodash/chunk": "npm:lodash@4.17.11/chunk.js",
        "lodash/clone": "npm:lodash@4.17.11/clone.js",
        "lodash/cloneDeep": "npm:lodash@4.17.11/cloneDeep.js",
        "lodash/concat": "npm:lodash@4.17.11/concat.js",
        "lodash/debounce": "npm:lodash@4.17.11/debounce.js",
        "lodash/defaults": "npm:lodash@4.17.11/defaults.js",
        "lodash/defaultsDeep": "npm:lodash@4.17.11/defaultsDeep.js",
        "lodash/differenceWith": "npm:lodash@4.17.11/differenceWith.js",
        "lodash/each": "npm:lodash@4.17.11/each.js",
        "lodash/escape": "npm:lodash@4.17.11/escape.js",
        "lodash/escapeRegExp": "npm:lodash@4.17.11/escapeRegExp.js",
        "lodash/every": "npm:lodash@4.17.11/every.js",
        "lodash/extend": "npm:lodash@4.17.11/extend.js",
        "lodash/filter": "npm:lodash@4.17.11/filter.js",
        "lodash/find": "npm:lodash@4.17.11/find.js",
        "lodash/findIndex": "npm:lodash@4.17.11/findIndex.js",
        "lodash/findKey": "npm:lodash@4.17.11/findKey.js",
        "lodash/flatMap": "npm:lodash@4.17.11/flatMap.js",
        "lodash/flatten": "npm:lodash@4.17.11/flatten.js",
        "lodash/forEach": "npm:lodash@4.17.11/forEach.js",
        "lodash/forIn": "npm:lodash@4.17.11/forIn.js",
        "lodash/forOwn": "npm:lodash@4.17.11/forOwn.js",
        "lodash/get": "npm:lodash@4.17.11/get.js",
        "lodash/has": "npm:lodash@4.17.11/has.js",
        "lodash/includes": "npm:lodash@4.17.11/includes.js",
        "lodash/indexOf": "npm:lodash@4.17.11/indexOf.js",
        "lodash/intersection": "npm:lodash@4.17.11/intersection.js",
        "lodash/intersectionWith": "npm:lodash@4.17.11/intersectionWith.js",
        "lodash/isArray": "npm:lodash@4.17.11/isArray.js",
        "lodash/isBoolean": "npm:lodash@4.17.11/isBoolean.js",
        "lodash/isBuffer": "npm:lodash@4.17.11/isBuffer.js",
        "lodash/isDate": "npm:lodash@4.17.11/isDate.js",
        "lodash/isEmpty": "npm:lodash@4.17.11/isEmpty.js",
        "lodash/isEqual": "npm:lodash@4.17.11/isEqual.js",
        "lodash/isFinite": "npm:lodash@4.17.11/isFinite.js",
        "lodash/isFunction": "npm:lodash@4.17.11/isFunction.js",
        "lodash/isInteger": "npm:lodash@4.17.11/isInteger.js",
        "lodash/isNaN": "npm:lodash@4.17.11/isNaN.js",
        "lodash/isNil": "npm:lodash@4.17.11/isNil.js",
        "lodash/isNull": "npm:lodash@4.17.11/isNull.js",
        "lodash/isNumber": "npm:lodash@4.17.11/isNumber.js",
        "lodash/isObject": "npm:lodash@4.17.11/isObject.js",
        "lodash/isString": "npm:lodash@4.17.11/isString.js",
        "lodash/isUndefined": "npm:lodash@4.17.11/isUndefined.js",
        "lodash/join": "npm:lodash@4.17.11/join.js",
        "lodash/keyBy": "npm:lodash@4.17.11/keyBy.js",
        "lodash/keys": "npm:lodash@4.17.11/keys.js",
        "lodash/map": "npm:lodash@4.17.11/map.js",
        "lodash/merge": "npm:lodash@4.17.11/merge.js",
        "lodash/min": "npm:lodash@4.17.11/min.js",
        "lodash/noop": "npm:lodash@4.17.11/noop.js",
        "lodash/omit": "npm:lodash@4.17.11/omit.js",
        "lodash/orderBy": "npm:lodash@4.17.11/orderBy.js",
        "lodash/parseInt": "npm:lodash@4.17.11/parseInt.js",
        "lodash/pick": "npm:lodash@4.17.11/pick.js",
        "lodash/pickBy": "npm:lodash@4.17.11/pickBy.js",
        "lodash/pull": "npm:lodash@4.17.11/pull.js",
        "lodash/range": "npm:lodash@4.17.11/range.js",
        "lodash/reject": "npm:lodash@4.17.11/reject.js",
        "lodash/remove": "npm:lodash@4.17.11/remove.js",
        "lodash/set": "npm:lodash@4.17.11/set.js",
        "lodash/size": "npm:lodash@4.17.11/size.js",
        "lodash/some": "npm:lodash@4.17.11/some.js",
        "lodash/sortBy": "npm:lodash@4.17.11/sortBy.js",
        "lodash/startsWith": "npm:lodash@4.17.11/startsWith.js",
        "lodash/sumBy": "npm:lodash@4.17.11/sumBy.js",
        "lodash/take": "npm:lodash@4.17.11/take.js",
        "lodash/throttle": "npm:lodash@4.17.11/throttle.js",
        "lodash/toArray": "npm:lodash@4.17.11/toArray.js",
        "lodash/toInteger": "npm:lodash@4.17.11/toInteger.js",
        "lodash/toString": "npm:lodash@4.17.11/toString.js",
        "lodash/unescape": "npm:lodash@4.17.11/unescape.js",
        "lodash/union": "npm:lodash@4.17.11/union.js",
        "lodash/unionBy": "npm:lodash@4.17.11/unionBy.js",
        "lodash/unionWith": "npm:lodash@4.17.11/unionWith.js",
        "lodash/uniqueId": "npm:lodash@4.17.11/uniqueId.js",
        "lodash/uniq": "npm:lodash@4.17.11/uniq.js",
        "lodash/identity": "npm:lodash@4.17.11/identity.js",
        "lodash/values": "npm:lodash@4.17.11/values.js",
        "lodash/zipObject": "npm:lodash@4.17.11/zipObject.js",

        "d3-force": "npm:d3@5.9.2",
        "d3-selection": "npm:d3@5.9.2",
        "d3-transition": "npm:d3@5.9.2",
        "d3-color": "npm:d3@5.9.2",
        "d3-array": "npm:d3@5.9.2",
        "d3-scale": "npm:d3@5.9.2",
        "d3-time": "npm:d3@5.9.2",
        "d3-time-format": "npm:d3@5.9.2",
        "d3-brush": "npm:d3@5.9.2",
        "d3-axis": "npm:d3@5.9.2",
        "d3-shape": "npm:d3@5.9.2",
        "d3-selection-multi": "npm:d3-selection-multi",

        '@nova-ui/bits': 'npm:@nova-ui/bits@latest',
        '@nova-ui/charts': 'npm:@nova-ui/charts@latest',
        '@nova-ui/dashboards': 'npm:@nova-ui/dashboards@latest',
    },
    packages: {
        app: {
            main: './main.ts',
            defaultExtension: 'ts'
        },
        rxjs: {
            main: 'index.js',
            defaultExtension: 'js'
        },
        'rxjs/operators': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        'lodash': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser': {
            main: '/bundles/platform-browser.umd.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser/animations': {
            main: '../bundles/platform-browser-animations.umd.js',
            defaultExtension: 'js'
        },
        '@angular/animations': {
            main: '/bundles/animations.umd.js',
            defaultExtension: 'js'
        },
        '@angular/animations/browser': {
            main: '../bundles/animations-browser.umd.js',
            defaultExtension: 'js'
        },
    }
});
`

    public getMainFile = (): string => `import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app';

platformBrowserDynamic().bootstrapModule(AppModule);
`

    public getIndexFile = (): string => `<!DOCTYPE html>
<html class="nui">

    <head>
        <base href="." />
        <title>Nova Demo</title>
        <link rel="stylesheet"
              href="https://unpkg.com/@nova-ui/bits@latest/bundles/css/styles.css"
        />
        <link rel="stylesheet"
              href="https://unpkg.com/@nova-ui/charts@latest/bundles/css/styles.css"
        />
        <script src="https://unpkg.com/core-js@^2.4.1/client/shim.js"></script>
        <script src="https://unpkg.com/zone.js@^0.8.25/dist/zone.js"></script>
        <script src="https://unpkg.com/zone.js@^0.8.25/dist/long-stack-trace-zone.js"></script>
        <script src="https://unpkg.com/reflect-metadata@^0.1.8/Reflect.js"></script>
        <script src="https://unpkg.com/systemjs@^0.19.40/dist/system.js"></script>
        <script src="config.js"></script>
        <script>
            System.import('app').catch(console.error.bind(console));
        </script>
    </head>

    <body>
        <my-app>Loading...</my-app>
    </body>

</html>
`
}
