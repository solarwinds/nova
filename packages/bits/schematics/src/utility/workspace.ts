// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
