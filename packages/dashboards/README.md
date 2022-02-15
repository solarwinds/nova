# Dashboards Overview

Nova Dashboards is a framework designed to provide feature developers with a common solution for 
presenting data coming from various sources within a single view, as well as a set of predefined widget 
visualizations that are 100% configuration-driven and designed specifically to conform to the Nova Design 
Language (NDL).

Even though NDL-prescriptive features are provided out of the box, the framework and its set of widgets 
are made to be flexible! Individual parts of it can be overridden, and custom widgets can be implemented 
without an inordinate amount of effort. However, as with any flexible framework, it's important to 
remember that the more customizations you create, the more initial work and maintenance effort you'll 
absorb into your product's code base. 

## Prerequisites
* The consumer app must be Angular-based
* Your development environment includes Node.js®, a package manager such as npm, and the Angular CLI
* Your package manager registries are set
* Nova Bits has been installed using the following command:
```sh
$ ng add @nova-ui/bits
```
If needed, further instructions for Bits installation can be found 
<a href="https://nova-ui.solarwinds.io/bits/release_v12.x/" target="_blank">here</a>.


#### Installing NodeJS and npm
To check your version of NodeJS, run node -v in a terminal/console window.
To get NodeJS which comes prepackaged with npm, go to <a href="https://nodejs.org/en/" target="_blank">nodejs.org</a>.

#### Installing Angular CLI
The Angular CLI is a command-line interface tool that you can use to initialize, develop, scaffold and 
maintain Angular applications. 

You may want to check first whether it's already installed by running the following command: 
```
ng --version
```
If you want to install it globally, run the following command: 
```
npm install -g @angular/cli
```

## Setup Options
#### Automated Installation and Setup Using the Angular CLI
The following schematics command will get dashboards ready for consumption in your project:
```sh
$ ng add @nova-ui/dashboards
```

Tasks performed by this command:
* Adds the `@nova-ui/dashboards` package and its associated dependencies to your package.json
* Performs an `npm install`
* Adds the necessary imports to your app's main module
* Adds the necessary style definitions to your app's angular.json file.

#### Manual Installation and Setup
Install with npm:
```sh
$ npm install angular-gridster2
$ npm install d3
$ npm install d3-selection-multi
$ npm install @nova-ui/charts
$ npm install @nova-ui/dashboards
```

Once all dependencies and project files are downloaded, add NuiDashboardsModule and 
BrowserAnimationsModule to your main Angular module's imports:
```js
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NuiDashboardsModule } from "@nova-ui/dashboards";

@NgModule({
    imports: [
        BrowserAnimationsModule,
        NuiDashboardsModule,
    ]
})
```

Finally, since some of the predefined widget types provided by Nova Dashboards have charts, your app must 
include the Nova Charts style definitions. To add them, modify your app's angular.json with the following 
addition to the styles source paths:
```json
"architect": {
   "build": {
      "options": {
          "styles": [
             "./node_modules/@nova-ui/charts/bundles/css/styles.css"
             ...
          ],
          ...
       }     
   }
}
```

## Start Implementing Your Dashboards
An **overview** of Nova Dashboards is available 
<a href="https://nova-ui.solarwinds.io/dashboards/release_v12.x/additional-documentation/overview.html">here</a>,
but if you'd prefer to dive right in, you can start with our **Hello, Dashboards!** tutorial 
<a href="https://nova-ui.solarwinds.io/dashboards/release_v12.x/additional-documentation/tutorials/hello-dashboards.html">here</a>.

[//]: # (Line breaks leave breathing room when the user scrolls to the bottom)
<br>
<br>
