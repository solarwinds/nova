// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { LogLevel } from "@solarwinds/nova-bits";

export const translationLibrary = "";

export const environment = {
    production: false,
    logLevel: LogLevel.info,
    nuiVersion: require("../../node_modules/@solarwinds/nova-bits/package.json").version,
};
