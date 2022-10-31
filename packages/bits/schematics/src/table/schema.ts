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
     * Specifies if declaring module exports the component.
     */
    export?: boolean;
    /**
     * Flag to indicate if a directory is created.
     */
    flat?: boolean;
    /**
     * Specifies whether to apply lint fixes after generating the component.
     */
    lintFix?: boolean;
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
     * Specifies if search feature is enabled (default true)
     */
    enableSearch?: boolean;
    /**
     * Specifies if sorting feature is enabled (default true)
     */
    enableSort?: boolean;
    /**
     * Specifies the presentation mode to be used for the list
     * (pagination | virtualScroll | none)
     */
    pagingMode?: string;
    /**
     * Specifies the selection mode to be used for the table
     */
    selectionMode: string;
    /**
     * Whether to generate client-side, server-side or custom DataSource
     */
    dataSource?: string;
    /**
     * Specifies the data source class
     * (when not provided the name parameter is used to generate the class name)
     */
    dataSourceName?: string;
    /**
     * Whether to generate standard or custom virtual scroll strategy
     */
    virtualScrollStrategy?: string;
}
