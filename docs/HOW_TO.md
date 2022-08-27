# How To...

## Run the Documentation Apps

Nova uses [CompoDoc](https://compodoc.app/) for documenting the APIs and usage instructions for its components. To run the documentation app in your development environment for any of the packages, open up a terminal with the root of the desired package (bits, charts, or dashboards) set as the current working directory, and run the `npm start` command.

The `start` task has two main procedures that it runs:

1. compiling the CompoDoc API docs
2. compiling the live examples of Nova's components.

**Note:** Depending on the size of the package, the example compilation may take a few minutes. So, if you don't see the examples show up in the browser right away, you likely haven't done anything wrong; it just takes some time to process the hundreds of examples that Nova has.

Each package serves up the docs on a different port. To see the app running in a browser, navigate to the following URL, replacing the placeholder with the correct port: `http:\\localhost:<port>`

#### Package-Port Mapping

| Package    | Port |
| ---------- | ---- |
| Bits       | 8080 |
| Charts     | 8070 |
| Dashboards | 8090 |

## Automation

### e2e Testing

#### Running e2e

All Nova projects (`bits`, `charts` and `dashboards`) have the following npm commands to run and/or debug
e2e tests:

-   `npm run e2e` - to compile the project and run e2e-tests
-   `npm run e2e-dev` - to run ONLY the tests without compiling the project under test. Note: For this
    task to work, the project itself should be served up separately by running `npm run start` in a
    separate console window.
-   `npm run e2e-debug` - similar to `e2e-dev`, but used for e2e debugging purposes. It allows `debugger`
    statements to be run.

#### Debugging e2e

<details>
  <summary>Click to view instructions on debugging e2e tests</summary>
    
`npm run e2e-debug` runs e2e tests using Protractor directly without the Angular e2e test wrapper (for
some reason the Angular version doesn't respond to `debugger` statements). After you run 
`npm run e2e-debug`, the node process will indicate that it's waiting until the debugger is attached by
showing a message in the console.

After that go to `chrome://inspect/#devices` and open the corresponding inspector under the **`target`**
category. The interpreter will now stop on `debugger` statements.

#### Using the VS Code Debugger

You can create a debugger configuration for debugging e2e tests in VS Code. Here are two configurations
for the debugger that can be added to the `launch.json` file under the `.vscode` directory in the project:

```js
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

-   `e2e attach` just attaches to the hosted process after running `npm run e2e-debug`.
-   `e2e debug and attach` first runs `npm run e2e-debug` and then attaches to the process (you should
    restart the debugger after you see `Debugger listening on...` in the console, because VS Code runs the
    task and debugger simultaneously)

To use the `preLaunchTask` mentioned in the `e2e debug and attach` configuration, add the following task
configuration to a `tasks.json` file:

```js
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

</details>

#### Atoms

Atoms are user friendly interfaces used to test components and directives. The main idea behind atoms is that the test environment should not need to know about:

-   The internal structure of a component under test
-   Class names that are applied in different component states
-   The details of a component's implementation
-   etc.

Atoms also provide information about their available features, states, attributes and nested components with intellisense right in the IDE. And, perhaps above all, they make tests more readable!

#### Using Nova Atoms

<details>
  <summary>Click to view instructions on using Nova Atoms</summary>

#### Two ways to instantiate an Atom:

1. Using its constructor. [Code Example](./packages/bits/spec/components/dialog/dialog.e2e.ts#L46)

    ```js
    dialog = new DialogAtom(element(by.className("nui-dialog")));
    ```

2. Finding an Atom in some context in the DOM. [Code Example](./packages/bits/spec/components/convenience/time-frame-bar/time-frame-bar.atom.ts#L28)

    ```js
    busy = Atom.findIn(BusyAtom, element(by.id("nui-busy-test-basic")));
    ```

#### Usage

1. Declare a variable with the proper type.
    ```js
    let defaultDialogBtn: ButtonAtom;
    ```
2. _browser.get()_ the test page make sure the page is loaded before trying to use an atom. If the page is not rendered, protractor obviously will throw the familiar "element not found" sorts of exceptions.
    ```js
    await browser.get(url);
    ```
3. Find atoms of the components before the tests run (use `beforeEach()` or `beforeAll()`).
    ```js
    beforeAll(async () => {
        await Helper.prepareBrowser("dialog");
        defaultDialogBtn = Atom.find(ButtonAtom, "nui-demo-default-dialog-btn");
    });
    ```
4. Use the variable containing an atom to call it's methods or for viewing\asserting it in the context of your tests.
   `js it("should add custom class to dialog", async () => { await customClassButton.click(); expect(await dialog.hasClass("demoDialogCustomClass")).toBe(true); }); `
   Note: If needed, atoms can be instantiated during test as well, for instance, if a component appears on the page conditionally.

#### API

Atoms for different components or directives will expectedly have different API. The only thing they have in common, however, is the base class they're inherited from - the **Atom class**. Each atom has access to the methods of the base Atom class.

**Atom** base class public API explained

|  #  | Field/Method                                                                                        | How it works                                                                                                                                                                                                                                                                                                                                                                                                            |
| :-: | :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | **STATIC**                                                                                          |
|  1  | _static_ `CSS_CLASS`                                                                                | This is how atoms are found in the DOM - thanks to this static css class. Different atoms must have different values here. [Example](./packages/bits/spec/components/dialog/dialog.atom.ts#11)                                                                                                                                                                                                                          |
|  2  | _static_ `find(atomClass: IAtomClass<T>, id: string)`                                               | Find a needed Atom within the parent element, found using it's unique id. This class uses findIn() method, described below. [Example](./packages/bits/spec/directives/tooltip/tooltip.visual.ts#23)                                                                                                                                                                                                                     |
|  3  | _static_ `findIn(atomClass: IAtomClass<T>, parentElement: ElementFinder, index?: number)`           | This is a basic method typically used to look for atoms in the DOM. It requires providing a desired atom name, the context where to look for it, and also an optional index parameter. The optional index param is used if there were more than one atom of a component found on the page, so the user can choose which one to take. [Example](./packages/bits/spec/components/checkbox-group/checkbox-group.e2e.ts#17) |
|  4  | _static async_ `findCount(atomClass: IAtomClass<T>, parentElement: ElementFinder): Promise<number>` | Is used to get the number of atoms found within the given context. Returns a promise.                                                                                                                                                                                                                                                                                                                                   |
|  5  | _static async_ `hasClass(el: ElementFinder, className: string): Promise<string>`                    | Is used to check that a certain css class has been applied to a selected element.                                                                                                                                                                                                                                                                                                                                       |
|  6  | _static async_ `hasAnyClass(el: ElementFinder, classNamesToSearch: string[]): Promise<string>`      | The same as `hasClass()`, with the only difference if can search for a number of classes in a given element.                                                                                                                                                                                                                                                                                                            |
|     | **NON-STATIC**                                                                                      |
|  7  | async `isDisplayed()`, async `isPresent()`                                                          | A simple wrapper around the same protractor methods.                                                                                                                                                                                                                                                                                                                                                                    |
|  8  | async `hasClass(className: string)`                                                                 | Does the same as the static one, but looks for the classes within the atom on which it was called. [Example](./packages/bits/spec/components/button/button.e2e.ts#36)                                                                                                                                                                                                                                                   |
|  9  | `getElement(): ElementFinder`                                                                       | Used to get the ElementFinder of the Atom.                                                                                                                                                                                                                                                                                                                                                                              |
| 10  | _async_ `isChildElementPresent(locator: any): Promise<boolean>`                                     | Pretty self-explanatory, it looks for a child element within the atom using a given Locator and verifies if it's present.                                                                                                                                                                                                                                                                                               |
| 11  | _async_ `hover(el?: ElementFinder, location?: ILocation)`                                           | If no params are provided then it hovers over itself. It will hover over the given element if ElementFinder is provided and over the given coordinates if ILocation is given. [Example](./packages/bits/spec/directives/tooltip/tooltip.visual.ts#38)                                                                                                                                                                   |
| 12  | _async_ `scrollTo()`                                                                                | Scrolls to the current atom so it appears in the viewport. Useful in cases when a desired element on the page, but not within the viewport, and is therefore not clickable. [Example](./packages/bits/spec/components/menu/menu.visual.ts#45)                                                                                                                                                                           |

</details>

## Link Projects for Development

To get your locally built library to be used as a dependency of another library or app you will need to do
two things:

-   Build the child library
-   Link build output so it will be consumed instead of the package installed from artifactory

### Building

In each library's `package.json` file there are couple of scripts for this. Check what are they doing.
Usually they are called `assemble`, `assemble:lib`, `assemble:dev`, or something like that.

In the root `package.json` there are scripts to run the builds of dependency libraries with a `--watch`
flag. They are **`build-watch:bits`** and **`build-watch:charts`** accordingly. It will do an incremental
build of your library on every file change which will in turn trigger a rebuild of your library/app if
it's running in watch mode too. Make sure to have separate terminal windows for running these tasks.

**Caveats**

-   The dev build of the library does not include schematics. Do the full `assemble` for this.
-   For updating global less and atoms or for regenerating css/fonts, you will need to restart the build
    task. These types of changes will not be picked up automatically.

### Linking

As `npm link` or `yarn link` proved to not work reliably with angular libraries, we are using regular
symbolic linked folders (junction for Windows file system).

To link things with each other we have some scripts in the `package.json` file.

-   **`charts-link:bits`** - removes the _`@nova-ui/bits`_ folder from charts' _`node_modules`_ and
    replaces it with a symlink to the _`dist`_ folder from bits.
-   **`dashboards-link:bits`** - does the same replacement for dashboards
-   **`dashboards-link:charts`** - links charts' _`dist`_ folder into dashboards' _`node_modules`_ in
    the same way as above
-   **`link:all`** - runs all the previous scripts that will link the internal dependencies

### Unlinking

For reverting what was done by the "link" scripts, there is also a set of opposites:
**`charts-unlink:bits`**, **`dashboards-unlink:bits`**, **`dashboards-unlink:charts`** and
**`unlink:all`**. To unlink both dependencies for dashboards in a single shot there is also
**`dashboards-unlink`**.

These scripts will remove the created symlinks and run `npm install` in the project folder, thus returning
your _`node_modules`_ to its initial state.
