# Bits Overview

In Bits, the philosophy is all about flexibility – it provides the Legos, plumbing and styles, while you control the layouts. Bits aims to provide high-quality, atomic building blocks, services and tools while allowing feature developers the ability to create whatever layouts they need.

## Prerequisites

Before you begin, make sure your development environment includes the following:

-   Node.js®
-   A package manager such as [npm](https://www.npmjs.com/get-npm)
-   Angular CLI v15
-   Angular CDK v15 as a devDependency

### Installing NodeJS and `npm`

To check your version, run node -v in a terminal/console window.
To get Node.js (which comes with `npm` out of the box), go to [nodejs.org](https://nodejs.org/en/).

### Installing Angular CLI

The Angular CLI is a command-line interface tool that you can use to initialize, develop, scaffold and maintain Angular applications.

You may want to check first whether it's already installed by running the following command:

```sh
ng --version
```

If you want to install the latest Angular CLI globally, run the following command:

```sh
npm install -g @angular/cli@15
```

### Installing Angular CDK

Nova uses Angular CDK as part of its schematics functionality. To install it, you can run the following command:

```sh
npm install @angular/cdk --save-dev
```

### Install Nova Bits

#### Using Angular CLI

In order to install bits in your project root using the CLI, run the following command:

```sh
ng add @nova-ui/bits
```

This will automatically perform most of the steps for you.

If you do not want to override your dependency versions, you can use skipPackageJson flag.

```sh
ng add @nova-ui/bits --skipPackageJson
```

But, there's one additional step that needs to be done manually. Since bits uses `@angular/localize` for localization, this dependency
needs to be imported in your app's polyfills.ts file. The easiest way to do this is to run the following command:

```sh
ng add @angular/localize
```

#### Using npm

Installation is quite simple using npm. Nui includes all of its dependencies as part of the final build such as Angular, RxJs and more.

```sh
npm install @nova-ui/bits
```

### Module Usage

#### Adding Modules to Your Project

Once all dependencies and project files are downloaded, import any component modules you want to use to the appropriate Angular
module in your project. The following example imports the `NuiButtonModule` to make the `ButtonComponent` available for use.

```js
import { NuiButtonModule } from "@nova-ui/bits";

@NgModule({
    imports: [
        NuiButtonModule
    ]
})
```

Note that, before alpha.15, the forRoot() method was used and an optional argument in `forRoot()` could be used to configure the Bits environment.
The current way to configure Bits is shown below:

```js
import { LogLevel, NuiEnvironment } from "@nova-ui/bits";

export class OverriddenNuiEnv extends NuiEnvironment {
    public logLevel: LogLevel = LogLevel.debug; // your override
}

@NgModule({
    imports: [],
    providers: [{
        provide: NuiEnvironment,
        useClass: OverriddenNuiEnv,
    }],
```

The Nova modules you consume will search for the NuiEnvironment provider and use it; otherwise, they will use the default one. At the moment, only log levels can be configured this way.

#### Add root dependencies

In your root module, you need to add these imports:

```js
imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ...
]
```

and these providers:

```javascript
providers: [
    {provide: TRANSLATIONS_FORMAT, useValue: "xlf"},
    {provide: MISSING_TRANSLATION_STRATEGY, useValue: MissingTranslationStrategy.Warning},
    {provide: TRANSLATIONS, useValue: ""},
    ...
]
```

The `TRANSLATIONS` provider can be used to internationalize bits. Details can be found [here](<https://ux.solarwinds.io/nova/docs/nova-bits/develop/sdk/api-docs-ng2/additional-documentation/internationalization-(i18n).html>).

#### Set root CSS class

To get some of the styles to display, you have to add the `nui` css class to the root html element:

```html
<html class="nui">
    <!--rest of page-->
</html>
```

#### Styles

##### Configuration

To add styling for Bits, you need to modify angular.json corresponding to the targeted project with the following additions:

1. Add the styles path to stylePreprocessorOptions.includePaths:

    ```json
    "architect": {
        "build": {
            "builder": "@angular-devkit/build-angular:browser",
            "options": {
                "stylePreprocessorOptions": {
                "includePaths": [
                    "./node_modules/@nova-ui/bits/sdk/less"
                ]
                },
                ...
            }
        }
    }
    ```

2. Add the styles path to the source paths:

    ```json
    "architect": {
        "build": {
            "options": {
                "styles": [
                    "./node_modules/@nova-ui/bits/bundles/css/styles.css"
                    ...
                ],
                ...
            }
        }
    }
    ```

**FYI - Bits does not use the Bootstrap component library nor does it include custom fonts.**

###### Naming Convention

We recommend the [BEM](http://getbem.com/) naming convention for your css/less variable names, but you're free to use whatever convention you prefer.

#### Typescript Compiler Options

## Schematics

A [schematic](https://angular.io/guide/schematics) is a template-based code generator that supports complex logic. It is a set of instructions for transforming a software project by generating or modifying code. Schematics are part of the Angular ecosystem.
Nova Bits offers the following [schematics](https://nova-ui.solarwinds.io/#/bits/release_v13.0.x/additional-documentation/schematics.html):

### Filtered View

[The Filtered View](https://nova-ui.solarwinds.io/#/bits/release_v13.0.x/additional-documentation/schematics/filtered-view.html)
schematic provides the ability to create a generic filtered view that can cover many use cases for filtering a set of data. Its main responsibility is to integrate a filter group panel with a list or table view that displays the filtered data. More details can be found [here](https://solarwinds.sharepoint.com/portals/hub/_layouts/15/PointPublishing.aspx?app=video&p=p&chid=8511af43-214a-435d-a605-dbe722ca04a0&vid=a5dbbef3-3582-49bf-b537-f789f946d09f)
To add a filtered view to your project, run the following command:

```sh
ng generate @nova-ui/bits:filtered-view --name=custom-name-for-filtered-view
```

### Filtered Group

[The Filtered Group](https://nova-ui.solarwinds.io/#/bits/release_v13.0.x/additional-documentation/schematics/filter-group.html)
schematic provides the ability to create a filtered group view. It depends heavily on the [LocalFilteringDataSource](https://nova-ui.solarwinds.io/#/bits/release_v13.0.x/injectables/LocalFilteringDataSource.html) service, so first and foremost please check out the documentation for it.
This code can be generated using the following command:

```sh
ng generate @nova-ui/bits:filter-group --name=basic-filter-group --p=app
```

### List

[The List](https://nova-ui.solarwinds.io/#/bits/release_v13.0.x/additional-documentation/schematics/list.html) schematic provides the
ability to create a generic list that can cover a majority of use cases for a list. Its main responsibility is to integrate the functionality of the [nui-repeat](https://nova-ui.solarwinds.io/#/bits/release_v13.0.x/components/RepeatComponent.html) component with other components commonly used with a list such as [nui-select-v2](https://nova-ui.solarwinds.io/#/bits/release_v13.0.x/components/SelectV2Component.html), [nui-search](https://nova-ui.solarwinds.io/#/bits/release_v13.0.x/components/SearchComponent.html), [nui-paginator](https://nova-ui.solarwinds.io/#/bits/release_v13.0.x/components/PaginatorComponent.html) and [nui-sorter](https://nova-ui.solarwinds.io/#/bits/release_v13.0.x/components/SorterComponent.html).
This code can be generated using the following command:

```sh
ng g @nova-ui/bits:list --name=basic-list --p=app
```

## What are Atoms?

Information about Atoms can be found [here](../../README.md#Atoms)
Bits atoms can be imported from here: `@nova-ui/bits/sdk/atoms`.

## Additional Information

### Supported browsers

Nova formally supports the following browsers. Support for IE11 has been dropped as of Nova v9.0.0.

1. Chrome
2. Firefox
3. Edge
4. Safari

### Date pipe Safari issue

Using date pipe, string should be provided according to ISO format. Otherwise, put Moment object instead to avoid error in Safari browser. Follow [this link](https://github.com/angular/angular/issues/17575) for more details.
