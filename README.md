# Nova Nui Framework

The Nova Nui Framework provides a set of common UI-based components and services to assist with rapid web application development. Nui is built on the latest Angular and follows modern UX design principles and front-end software development practices.

## Nova Design Spec 

The main specification can be found in the [Nova Design System](https://ux.solarwinds.io/design/)

## Style Guide

<details>
  <summary>Click to view the guide</summary>
  
  ### Component development
  * Library components have to work in OnPush change detection mode
Why? We have no control over user environment and change detection strategy is subject to consumer's freedom of choice. Therefore we need to make sure that components we provide work under both, where ChangeDetectionStrategy.OnPush is stricter than Default, so we need to support OnPush.
  * Add an explanatory inline comment to every usage of setTimeout() (and other situations when code is not self-explanatory)
Why? setTimeout is tied to a wider context of executed code, which might not be apparent from reading the code. Documenting the setTimeout usage helps to understand that context.
  * Be aware that the following ResizeObserver polyfill usage does not work in Firefox:
    ```
    this.resizeObserver.observe(this.el.nativeElement);
    ```
	But the following works in all major browsers:
    ```
    this.ngZone.runOutsideAngular(() => {​​​
        this.resizeObserver.observe(this.el.nativeElement);
    }​​​​​​​​​​);
    ```
The reason for this is that, since in Firefox ResizeObserver is not native (as of July 2019), it isn't "hacked" by ZoneJS, so it needs to be explicitly executed outside of Angular.

* ngOnDestroy and Component Inheritance

	A little known fact about Angular and component inheritance is that calls to ngOnDestroy do not automatically get propagated to base classes. This can lead to memory leaks if a derived class implements ngOnDestroy and its base class unsubscribes from one or more observables in its own ngOnDestroy implementation for example.
    
	As a safe guard, if you find yourself extending a component from a base class, it's best to go ahead and implement an ngOnDestroy in both the base class and the derived class. Then, in the derived class call super.ngOnDestroy(). This will ensure that any observables added to the base class at a later date will be unsubscribed.
    Base:
    ```
    public ngOnDestroy() {​​​​​​​​​​
    // Added as a safeguard. Inherited classes will invoke this
    // so that any observables added to this base class will
    // be unsubscribed.
    }​​​​​​​​​​
    ```
    Derived:
    ```
    public ngOnDestroy() {​​​​​​​​​​
    // Added as a safeguard. Invoking the base class ngOnDestroy
    // ensures that any base class observables are unsubscribed.
    super.ngOnDestroy();
    }​​​​​​​​​​
    ```

  ### Documentation
  1. Put example data at the bottom of examples
     Why? To avoid scrolling after opening the example source code, put all the mocked data at the bottom of the example. [This example](https://github.com/solarwinds/nova/blob/main/packages/charts/examples/components/demo/chart-types/line/line-chart-basic/line-chart-basic.example.component.ts#L41-L68) shows how we do this.
  2. Define a route for every example
     Why? This is useful not only for running tests, but especially for debugging and discovering problems in examples throwing errors to the console. Limiting the amount of code executed on the page to a single example tremendously helps with setting breakpoints. Check [this example](https://github.com/solarwinds/nova/blob/main/packages/charts/examples/components/demo/chart-types/line/chart-docs-line.module.ts#L22-L100) to see how we do this.
  3. Use fixed data for the examples.
     Why? Because we have a goal to visually test all the examples in the documentation, we need them to be predictable. For that reason please avoid using randomized data (or any unpredictable elements) in your documentation examples.
  ### Internationalization
  [Current documentation](#)

  Basic summary:
  1. Make sure to make any text with variables/placeholders readable for less technical person (calling "humanize" is not understandable).
  2. If a function call is needed within the text inside a template, ensure that the name is simple and self-documenting (for a person not familiar with the code) or add a comment for the translator
  3. Because many languages have complicated rules, it's important to provide context around variables to ensure that the translator is able to use the correct form, gender, ordering of words, etc.
  4. Translators have tools which (as long as we are using standard form) ensure they don't accidentally change variables
  5. Its good to replace numbers with placeholders in messages containing validations and similar things as these numbers change with time and would need unnecessary change in translated texts.

  ### Testing
  #### `setTimeout`, `setInterval` and `requestAnimationFrame`'s  testability
  
  When you are using timeouts or intervals for animations or countdowns, protractor tests can fail with a timeout.
  Protractor has a built-in feature in which it waits for Angular events to finish before proceeding. The methods listed above will hold the process, and protractor will not continue the test flow until they finish.
 
  To avoid this situation, replace code like:
  `setTimeout(() => callback(), timeOut);`
  with the following solution:

```
ngZone.runOutsideAngular(() => {​​​​
  // running timeout outside of angular zone
  setTimeout(() => {​​​​
    ngZone.run(() => {​​​​
      // callback function should be executed in zone to preserve the angular change detection
      callback();
    }​​​​);
  }​​​​, timeOut);
}​​​​);
```
This code snippet allows protractor to run asserts and continue testing while a timeout is in progress.

  #### `Atoms`
  Atom is a user friendly interface to test a component.
  The idea behind atom is that tester should not know about
  * internal structure of the component
  * class names that are applied in different states
  * details of its implementation
  * etc.
Also it provides the information about available features, states, attributes and nested components with intellisense right in the IDE.
It makes tests more readable.

  #### `Top 10 E2E Guidelines`
  1. Do not operate with ElementFinder or ElementFinderArray in you test.
  2. Do not return ElementFinder or ElementFinderArray from the atom.
  3. Build test pages that give a tester full control over the input data (configuration) and full access to the output verification.
  4. Build page objects for test pages. Think of them as a page level atom classes.
  5. Use properties, not functions to retrieve child elements in your atom. As atom encapsulates one single component instance it should return the same sub-component in it's structure. No need to   search for it every time. Use public properties for child atoms and private properties for internal ElementFinders.
  6. Remember your root element. No need to call getElement() function every time.
  7. Return promises from atom methods. Avoid return await doSomething(); . Tester should await it himself.
  8. Do not return childElements as array of Atoms. To build it you will need to iterate through entire set of elements. Tester will need to do it too.
  9. Return childElementsCount():Promise<number> and getChildElement(id or index):Atom. If tester will need to iterate through all of them he will retrieve every DOM element just once. Also consider methods like getChildTexts():Promise<string[]> , getChildValues():Promise<number[]> etc.
  10. Test your atoms. Don't hesitate to write a test that will check that atom works when it should and doesn't work when it shouldn't.

</details>

## Structure

We are developing 3 component libraries:

* [Nova-Bits](./packages/bits/README.md) - atomic components to be used as building blocks for applications and more complex 
components. Exception - **convenience components** - prototypes of composite components, that are meant 
to accommodate a wide breadth of use cases.
* [Nova-Charts](./packages/charts/README.md) - visualization library built on top of [d3](https://d3js.org/).
* [Nova-Dashboards](./packages/dashboards/README.md) - you got it.

## Linking Projects for Development

To get your locally built library to be used as a dependency of another library or app you will need to do
two things:

* Build the child library
* Link build output so it will be consumed instead of the package installed from artifactory

### Building

In each library's `package.json` file there are couple of scripts for this. Check what are they doing.
Usually they are called `assemble`, `assemble:lib`, `assemble:dev`, or something like that.

In the root `package.json` there are scripts to run the builds of dependency libraries with a `--watch`
flag. They are **`build-watch:bits`** and **`build-watch:charts`** accordingly. It will do an incremental
build of your library on every file change which will in turn trigger a rebuild of your library/app if
it's running in watch mode too. Make sure to have separate terminal windows for running these tasks.

**Caveats**

* The dev build of the library does not include schematics. Do the full `assemble` for this.
* For updating global less and atoms or for regenerating css/fonts, you will need to restart the build
task. These types of changes will not be picked up automatically.

### Linking

As `npm link` or `yarn link` proved to not work reliably with angular libraries, we are using regular
symbolic linked folders (junction for Windows file system).

To link things with each other we have some scripts in the `package.json` file.

* **`charts-link:bits`** - removes the *`@nova-ui/bits`* folder from charts' *`node_modules`* and
replaces it with a symlink to the *`dist`* folder from bits.
* **`dashboards-link:bits`** - does the same replacement for dashboards
* **`dashboards-link:charts`** - links charts' *`dist`* folder into dashboards' *`node_modules`* in
the same way as above
* **`link:all`** - runs all the previous scripts that will link the internal dependencies

### Unlinking

For reverting what was done by the "link" scripts, there is also a set of opposites:
**`charts-unlink:bits`**, **`dashboards-unlink:bits`**, **`dashboards-unlink:charts`** and
**`unlink:all`**. To unlink both dependencies for dashboards in a single shot there is also
**`dashboards-unlink`**.

These scripts will remove the created symlinks and run `npm install` in the project folder, thus returning 
your *`node_modules`* to its initial state.

## Running and Debugging e2e Tests

All Nova projects (`bits`, `charts` and `dashboards`) have the following npm commands to run and/or debug
e2e tests:

-   `npm run e2e` - to compile the project and run e2e-tests
-   `npm run e2e-dev` - to run ONLY the tests without compiling the project under test. Note: For this
    task to work, the project itself should be served up separately by running `npm run start` in a
    separate console window.
-   `npm run e2e-debug` - similar to `e2e-dev`, but used for e2e debugging purposes. It allows `debugger`
    statements to be run.

**Debugging e2e**

`npm run e2e-debug` runs e2e tests using Protractor directly without the Angular e2e test wrapper (for
some reason the Angular version doesn't respond to `debugger` statements). After you run 
`npm run e2e-debug`, the node process will indicate that it's waiting until the debugger is attached by
showing a message in the console.

After that go to `chrome://inspect/#devices` and open the corresponding inspector under the **`target`**
category. The interpreter will now stop on `debugger` statements.

**Using the VS Code Debugger**

You can create a debugger configuration for debugging e2e tests in VS Code. Here are two configurations
for the debugger that can be added to the `launch.json` file under the `.vscode` directory in the project:

```
{
  "type": "node",
  "request": "attach",
  "name": "e2e attach",
  "port": 9229
},
{
  "type": "node",
  "request": "attach",
  "name": "e2e debug and attach",
  "port": 9229,
  "preLaunchTask": "e2e-debug"
}
```

- `e2e attach` just attaches to the hosted process after running `npm run e2e-debug`.
- `e2e debug and attach` first runs `npm run e2e-debug` and then attaches to the process (you should
restart the debugger after you see `Debugger listening on...` in the console, because VS Code runs the
task and debugger simultaneously)

To use the `preLaunchTask` mentioned in the `e2e debug and attach` configuration, add the following task
configuration to a `tasks.json` file:

```
{
  "version": "2.0.0",
  "tasks": [
      {
          "label": "e2e-debug",
          "command": "npm run e2e-debug",
          "args": [],
          "type": "shell"
      }
  ]
}
```

## Contribution

We encourage [contributions to Nova](./CONTRIBUTION.md) whenever your team needs a new component, new functionality in an existing component, new icons, bug fixes or atom extensions.

## Need help?

Need help using Nova?

First, please go over our [FAQ](https://github.com/solarwinds/nova/wiki/FAQ). If you don't find the answer
to your question there, feel free to send us an email at <nova-ui@solarwinds.com>. We kindly ask that you 
refrain from opening GitHub issues for general support questions as we want to reserve that 
communications channel for bug reports and feature requests.

## Found a bug? Have an idea for a feature?

Please let us know! But...before submitting a feature request or issue for Nova UI, make sure it hasn't already been requested on our [issues page](https://github.com/solarwinds/nova/issues). If you can't find an existing issue
corresponding to your feedback, please create one using the GitHub [issue portal](https://github.com/solarwinds/nova/issues/new/choose).
