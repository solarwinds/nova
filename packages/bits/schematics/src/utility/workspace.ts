/*****************************************************************
 *
 * This file consists of schematics utility functions recovered from deletions in the angular-cli repo
 * https://github.com/angular/angular-cli/commit/5ebb100877d7d73da4379e244371194190f818fa
 *
 *****************************************************************/

import { JsonParseMode, parseJson } from "@angular-devkit/core";
import { SchematicsException, Tree } from "@angular-devkit/schematics";
import { WorkspaceSchema } from "@schematics/angular/utility/workspace-models";

export function getWorkspacePath(host: Tree): string {
    const possibleFiles = ["/angular.json", "/.angular.json"];
    const path = possibleFiles.filter(p => host.exists(p))[0];
    return path;
}

export function getWorkspace(host: Tree): WorkspaceSchema {
    const path = getWorkspacePath(host);
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new SchematicsException(`Could not find (${path})`);
    }
    const content = configBuffer.toString();

    return parseJson(content, JsonParseMode.Loose) as {} as WorkspaceSchema;
}
