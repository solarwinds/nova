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
 * https://github.com/angular/angular-cli/commit/51549977286904b65c800f44792e19ed671c3b8d
 *
 *****************************************************************/

import { Tree } from "@angular-devkit/schematics/src/tree/interface";
import {
    ProjectType,
    WorkspaceProject,
    WorkspaceSchema,
} from "@schematics/angular/utility/workspace-models";

import { getWorkspace } from "./workspace";

export function buildDefaultPath(project: WorkspaceProject): string {
    const root = project.sourceRoot
        ? `/${project.sourceRoot}/`
        : `/${project.root}/src/`;

    const projectDirName =
        project.projectType === ProjectType.Application ? "app" : "lib";

    return `${root}${projectDirName}`;
}

export function getProject<
    TProjectType extends ProjectType = ProjectType.Application
>(
    workspaceOrHost: WorkspaceSchema | Tree,
    projectName: string
): WorkspaceProject<TProjectType> {
    const workspace = isWorkspaceSchema(workspaceOrHost)
        ? workspaceOrHost
        : getWorkspace(workspaceOrHost);

    return workspace.projects[projectName] as WorkspaceProject<TProjectType>;
}

export function isWorkspaceSchema(
    workspace: any
): workspace is WorkspaceSchema {
    return !!(workspace && (workspace as WorkspaceSchema).projects);
}

export function isWorkspaceProject(project: any): project is WorkspaceProject {
    return !!(project && (project as WorkspaceProject).projectType);
}
