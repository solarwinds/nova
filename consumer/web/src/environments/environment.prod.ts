import { LogLevel } from "@solarwinds/nova-bits";

export const translationLibrary = "";

export const environment = {
  production: true,
    logLevel: LogLevel.warn,
    nuiVersion: require("../../node_modules/@solarwinds/nova-bits/package.json").version,
};
