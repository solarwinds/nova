# How To&hellip;

## Run the Documentation Apps

Nova uses [CompoDoc](https://compodoc.app/) for documenting the APIs and usage instructions for its components. To run the documentation app in your development environment for any of the packages, open up a terminal with the root of the desired package (bits, charts, or dashboards) set as the current working directory, and run the `npm start` command.

The `start` task has two main procedures that it runs:

1. compiling the CompoDoc API docs
2. compiling the live examples of Nova's components.

**Note:** Depending on the size of the package, the example compilation may take a few minutes. So, if you don't see the examples show up in the browser right away, you likely haven't done anything wrong; it just takes some time to process the hundreds of examples that Nova has.

Each package serves up the docs on a different port. To see the app running in a browser, navigate to the following URL, replacing the placeholder with the correct port: `http:\\localhost:<port>`

### Package-Port Mapping

| Package    | Port |
| ---------- | ---- |
| Bits       | 8080 |
| Charts     | 8070 |
| Dashboards | 8090 |

## Automation

### e2e Testing

[Read about the e2e testing here](./E2E/README.md).

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

#### Caveats

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
