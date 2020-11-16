/**
 * $localize angular polyfill
 */
import "@angular/localize/init";
import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

// if (process.env.ENV === "production") {
//     // Production
// } else {
//     // Development
//     (<any>Error)["stackTraceLimit"] = Infinity;
//     require("zone.js/dist/long-stack-trace-zone");
// }
