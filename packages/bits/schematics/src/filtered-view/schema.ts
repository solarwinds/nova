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

export interface Schema {
    /**
     * Specifies if the component is an entry component of declaring module.
     */
    entryComponent?: boolean;
    /**
     * Specifies if declaring module exports the component.
     */
    export?: boolean;
    /**
     * Flag to indicate if a directory is created.
     */
    flat?: boolean;
    /**
     * Applies lintFix after schematic is generated
     */
    lintFix?: boolean;
    /**
     * Specifies how the filter results will be presented, e.g. table or list
     */
    presentationType: string;
    /**
     * Allows specification of the declaring module.
     */
    module?: string;
    /**
     * The name of the component.
     */
    name: string;
    /**
     * The path to create the component.
     */
    path?: string;
    /**
     * The prefix to apply to generated selectors.
     */
    prefix?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * The selector to use for the component.
     */
    selector?: string;
    /**
     * Flag to skip the module import.
     */
    skipImport?: boolean;
    /**
     * Specifies if a spec file is generated.
     */
    spec?: boolean;
    /**
     * Inserting proper element into filtered-view component using this selector
     */
    childSelector?: string;
    /**
     * Specifies the presentation mode to be used for the component
     * (pagination | virtualScroll | none)
     */
    pagingMode: string;
    /**
     * Whether to generate client-side, server-side or custom DataSource
     */
    dataSource?: string;
    /**
     * Specifies if search feature is enabled (default true)
     */
    enableSearch?: boolean;
    /**
     * Specifies if sorting feature is enabled (default true)
     */
    enableSort?: boolean;
    /**
     * Whether to generate standard or custom virtual scroll strategy
     */
    virtualScrollStrategy?: string;
    /**
     * Specifies the selection mode to be used for the component
     */
    selectionMode?: string;
    /**
     * Whether to add chips representation for Filter Groups
     */
    chips?: boolean;
}
