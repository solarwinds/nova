# Nova Library Development

## Nova Design Spec 

The main specification can be found in [Marvel](https://marvelapp.com/project/3222505/)

## Style Guide

<details>
  <summary>Click to expand!</summary>
  
  ### Component development
  1. Library components have to work in OnPush change detection mode
Why? We have no control over user environment and change detection strategy is subject to consumer's freedom of choice. Therefore we need to make sure that components we provide work under both, where ChangeDetectionStrategy.OnPush is stricter than Default, so we need to support OnPush.
  2. Document every setTimeout() (and other situations when code is not self-explanatory)
Why? setTimeout is tied to a wider context of executed code, which might not be apparent from reading the code. Documenting the setTimeout usage helps to understand that context.
  3. ResizeObserver polyfill usage

```
this.resizeObserver.observe(this.el.nativeElement);
```

 does not work in Firefox, but this:

```
this.ngZone.runOutsideAngular(() => {​​​
    this.resizeObserver.observe(this.el.nativeElement);
}​​​​​​​​​​);
```
 always works. The reason is that since in Firefox ResizeObserver is not native (as of July 2019), it is not hacked by ZoneJS, which means it should be explicitly stated that it needs to be executed outside of Angular.
   4. 

</details>

## Structure

We are developing 3 component libraries:

* **nova-bits** - atomic components to be used as building blocks for applications and more complex 
components. Exception - **convenience components** - prototypes of composite components, that are meant 
to accommodate a wide breadth of use cases.
* **nova-charts** - visualization library built on top of [d3](https://d3js.org/).
* **nova-dashboards** - you got it.

## Linking Projects for Development

To get your locally built library to be used as a dependancy of another library or app you will need to do
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

As `npm link` or `yarn link` proved to not work reliably with angular libraies, we are using regular
symbolic linked folders (junction for Windows file system).

To link things with each other we have some scripts in the `package.json` file.

* **`charts-link:bits`** - removes the *`@solarwinds/nova-bits`* folder from charts' *`node_modules`* and
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
