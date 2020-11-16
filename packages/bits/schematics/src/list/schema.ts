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
     * Specifies the selection mode to be used for the list
     */
    selectionMode: string;
    /**
     * Specifies the presentation mode to be used for the list
     * (pagination | virtualScroll | none)
     */
    pagingMode: string;
    /**
     * Specifies if search feature is enabled (default true)
     */
    enableSearch?: boolean;
    /**
     * Specifies if sorting feature is enabled (default true)
     */
    enableSort?: boolean;
    /**
     * Flag to skip the module import.
     */
    skipImport?: boolean;
    /**
     * Specifies if a spec file is generated.
     */
    spec?: boolean;
    /**
     * Whether to generate client-side, server-side or custom DataSource
     */
    dataSource?: string;
    /**
     * Specifies the data source class
     * (when not provided the name parameter is used to generate the class name)
     */
    dataSourceName?: string;
}
