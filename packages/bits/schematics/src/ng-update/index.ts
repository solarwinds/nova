import { chain, noop, Rule, SchematicContext, SchematicsException, Tree } from "@angular-devkit/schematics";

import { updateJsonFile } from "../schematics-helper";

export default function (options: any): Rule {
    if (!options.project) {
        throw new SchematicsException("Option (project) is required.");
    }

    return chain([
        options && options.skipCss ? noop() : addCssToAngularJson(options),
    ]);
}

function addCssToAngularJson(options: any) {
    return (host: Tree, context: SchematicContext) => {
        updateJsonFile(host,
            context,
            "angular.json",
            [
                "projects",
                options.project,
                "architect",
                "build",
                "options",
                "styles",
            ],
            ["./node_modules/@solarwinds/nova-bits/bundles/css/styles-v7-compat.css"]
        );
    };
}
