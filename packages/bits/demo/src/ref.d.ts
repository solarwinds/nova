/**
 * We need to have an ambient declaration of the module that we're importing from the demo.
 * It's declared as an external in webpack and is retrieved through global variable called "Nui" - see gulpfile.js
 */
declare module "nui" {
    const _temp: any;
    export = _temp;
}
