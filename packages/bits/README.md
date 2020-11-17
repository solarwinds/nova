# Nova Nui Framework

The Nova Nui Framework provides a set of common UI-based components and services to assist with rapid web application development. Nui is built on the latest Angular and follows modern UX design principles and front-end software development practices.

# Nova Bits

In Bits, the philosophy is all about flexibility – it provides the Legos, plumbing and styles, while you control the layouts. Bits aims to provide high-quality, atomic building blocks, services and tools while allowing feature developers the ability to create whatever layouts they need.
<br>
<br>


## Prerequisites

Before you begin, make sure your development environment includes Node.js®, an npm package manager and the npm registries set.
<br>

#### Installing NodeJS
To check your version, run node -v in a terminal/console window.
To get Node.js, go to [nodejs.org](https://nodejs.org/en/).

#### Installing Angular CLI
The Angular CLI is a command-line interface tool that you can use to initialize, develop, scaffold and maintain Angular applications. 

You may want to check first whether it's already installed by running the following command: 
```
ng --version
```
If you want to install it globally, run the following command: 
```
npm install -g @angular/cli
```

#### Configuring the npm registry

In order to configure your npm registry to get all @solarwinds packages from our internal artifactory, run the following command: 
```
npm config set @solarwinds:registry http://dev-brn-art-02.swdev.local:8081/artifactory/api/npm/npm
``` 
<br>
<br>


# Install Nova Bits or [Try the Playground](https://bitbucket.solarwinds.com/projects/NOVA/repos/nova-playground/browse)

#### Using Angular CLI
In order to install nova-bits in your project root using the CLI, run the following command: 
```
ng add @solarwinds/nova-bits
```
This will automatically perform most of the steps for you.

But, there's one additional step that needs to be done manually. Since nova-bits uses `@angular/localize` for localization, this dependency 
needs to be imported in your app's polyfills.ts file. The easiest way to do this is to run the following command:
```
ng add @angular/localize
```

#### Using npm
Installation is quite simple using npm. Nui includes all of its dependencies as part of the final build such as Angular, RxJs and more.
```
$ npm install @solarwinds/nova-bits
```
<br><br>


# Module Usage

#### Adding Modules to Your Project
Once all dependencies and project files are downloaded, import any component modules you want to use to the appropriate Angular
module in your project. The following example imports the `NuiButtonModule` to make the `ButtonComponent` available for use.

```js
import { NuiButtonModule } from "@solarwinds/nova-bits";

@NgModule({
    imports: [
        NuiButtonModule
    ]
})
```

Note that, before alpha.15, the forRoot() method was used and an optional argument in `forRoot()` could be used to configure the Bits environment. 
The current way to configure Bits is shown below:

```js
import { LogLevel, NuiEnvironment } from "@solarwinds/nova-bits";

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

<br>

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
The `TRANSLATIONS` provider can be used to internationalize nova-bits.  Details here: https://cp.solarwinds.com/display/NU/i18n+for+Nova
<br>

#### Set root CSS class
To get some of the styles to display, you have to add the `nui` css class to the root html element:

```html
<html class="nui">
    <!--rest of page-->
</html>
```
<br>

#### Styles

###### Configuration
To add styling for Bits, you need to modify angular.json corresponding to the targeted project with the following additions:
1. Add the styles path to stylePreprocessorOptions.includePaths:
```json
 "architect": {
    "build": {
      "builder": "@angular-devkit/build-angular:browser",
      "options": {
        "stylePreprocessorOptions": {
         "includePaths": [
              "./node_modules/@solarwinds/nova-bits/sdk/less"
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
             "./node_modules/@solarwinds/nova-bits/bundles/css/styles.css"
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
<br>


#### Set Typescript Compiler Options
To avoid compilation errors caused by tree-shaking of lodash, tsconfig.json of your project needs to have `allowSyntheticDefaultImports: true` property in compilerOptions.
If you have compilation error like `TypeError: find_1.default is not a function` when running tests you might need to add `esModuleInterop: true` to your compilerOptions. Or you can try Solution #2 from this [article](https://medium.com/martin_hotell/tree-shake-lodash-with-webpack-jest-and-typescript-2734fa13b5cd).
More details can be found [here](https://cp.solarwinds.com/pages/viewpage.action?spaceKey=NU&title=Tree+Shake+Lodash).
<br>

#### Exclude highlight.js languages
By default Nova requires highlight.js (which normally goes with all of its languages which even Nova does not use). This can result in an excessively large bundle size (adds ~1MB). You can exclude the languages by updating the highlight.js import path inside your tsconfig.json file.
```
"compilerOptions": {
    "paths": {
      "highlight.js": ["./node_modules/highlight.js/lib/highlight.js"]
    }
  },
```
<br>

## Schematics
A [schematic](https://angular.io/guide/schematics) is a template-based code generator that supports complex logic. It is a set of instructions for transforming a software project by generating or modifying code. Schematics are part of the Angular ecosystem. 
Nova Bits offers the following [schematics](http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/additional-documentation/schematics.html):  

#### Filtered View
[The Filtered View](http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/additional-documentation/schematics/filtered-view.html) schematic provides the ability to create a generic filtered view that can cover many use cases for filtering a set of data. Its main responsibility is to integrate a filter group panel with a list or table view that displays the filtered data. More details can be found [here](https://solarwinds.sharepoint.com/portals/hub/_layouts/15/PointPublishing.aspx?app=video&p=p&chid=8511af43-214a-435d-a605-dbe722ca04a0&vid=a5dbbef3-3582-49bf-b537-f789f946d09f)
To add a filtered view to your project, run the following command: 
```
ng generate @solarwinds/nova-bits:filtered-view --name=custom-name-for-filtered-view
```
<br>

#### Filtered Group
[The Filtered Group](http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/additional-documentation/schematics/filter-group.html) schematic provides the ability to create a filtered group view. It depends heavily on the [LocalFilteringDataSource](http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/injectables/LocalFilteringDataSource.html) service, so first and foremost please check out the documentation for it.
This code can be generated using the following command: 
```
ng generate @solarwinds/nova-bits:filter-group --name=basic-filter-group --p=app
```
<br>

#### List
[The List](http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/additional-documentation/schematics/list.html) schematic provides the ability to create a generic list that can cover a majority of use cases for a list. Its main responsibility is to integrate the functionality of the [nui-repeat](http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/components/RepeatComponent.html) component with other components commonly used with a list such as [nui-select](http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/components/SelectComponent.html), [nui-search](http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/components/SearchComponent.html), [nui-paginator](http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/components/PaginatorComponent.html) and [nui-sorter](http://apollo-docs.swdev.local/nova-bits/release_nova_v8.x/sdk/api-docs-ng2/components/SorterComponent.html).
This code can be generated using the following command: 
```
ng g @solarwinds/nova-bits:list --name=basic-list --p=app
```
<br>


## What are Atoms?
[Atoms](https://cp.solarwinds.com/display/NU/How+to+Use+NOVA+Atoms) are the custom implementation of a well-known PageObject pattern. They are useful when it comes to e2e and visual testing an app containing Nova components and directives.
They can be found in @solarwinds/nova-bits/sdk/atoms. Note that, while they are useful for e2e and visual tests, they are not suitable for unit testing.

## Contribution

We encourage [contributions to Nui](https://cp.solarwinds.com/display/NU/Contribute+to+Nova) whenever your team needs a new component, new functionality in an existing component, new icons, bug fixes or atom extensions. We're capable of releasing very quickly if you need to consume your changes as soon as possible - just let us know via Slack, email or Jira. We want to make sure you and your teams are empowered to get your features built without being blocked by us.

## AoT Support

Nova Nui supports AoT. For a primer on AoT, you can go [here](https://angular-2-training-book.rangle.io/handout/aot/) or for
a more detailed overview you can go [here](https://angular.io/guide/aot-compiler).

<br><br>

# Additional Information

### Supported browsers

Nova formally supports the following browsers. Support for IE11 has been dropped as of Nova v9.0.0.
1. Chrome
2. Firefox
3. Edge
4. Safari
<br>

### Date pipe Safari issue

Using date pipe, string should be provided according to ISO format. Otherwise, put Moment object instead to avoid error in Safari browser. Follow [this link](https://github.com/angular/angular/issues/17575) for more details.


### Need help?

Need help using Nui?

Firstly, please go over our [FAQ](https://cp.solarwinds.com/display/NU/FAQ). We kindly ask that you not open Jira tickets for general support questions as we want to reserve Jira for bug reports and feature requests.

The [SWI - Nova](https://bit.ly/2P2fsMM) channel on Teams is a much better place to ask questions.


### Found a bug?

In order to reproduce bugs we ask that you to provide a _minimal_ repro scenario and a link to the live repro environment.

To submit feature requests and/or defects for Nui, [head over to this page for instructions](https://cp.solarwinds.com/display/NU/Feature+requests+and+report+defects+for+Nova+UI).

<br><br>

# Development, roadmap and more...

Our program roadmap [is here](https://jira.solarwinds.com/secure/RapidBoard.jspa?rapidView=1805) and shows the priorities of very large features that are expected to take longer than 6 months. Our [technical roadmap](https://jira.solarwinds.com/secure/RapidBoard.jspa?rapidView=1798) is a much more granular view of the program roadmap and is basically the view for the current quarter.

### Need to add a new icon?

It's pretty simple to [add a new icon](https://cp.solarwinds.com/pages/viewpage.action?pageId=92545319) to the repository for your product. If you need a new icon(s) as part of a patch/hotfix, just let us know via Teams or Jira and we'll make sure your changes are applied to the appropriate branch(es).
