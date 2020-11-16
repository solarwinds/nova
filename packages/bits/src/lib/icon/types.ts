export interface IconData {
    svgFile: string;
    name: string | MappedIconNames;
    cat_namespace?: string | IconCategoryNamespace;
    category: string | IconCategory;
    code: string;
}

export enum IconCategory {
    Command = "command",
    HealthStatus = "health-status",
    Object = "object",
    Severity = "severity",
    State = "state",
    Tab = "tab",
    Widget = "widget",
}

export enum IconCategoryNamespace {
    Command = "command_",
    Object = "object_",
    Severity = "severity_",
    State = "state_",
    Status = "status_",
    Widget = "widget_",
}

export type MappedIconNames = IconSeverity | IconState | IconWidget;

export enum IconStatus {
    // TODO: Remove in V10
    /** @deprecated Use Pascal Case Instead */
    acknowledged = "acknowledged",
    /** @deprecated Use Pascal Case Instead */
    critical = "critical",
    /** @deprecated Use Pascal Case Instead */
    down = "down",
    /** @deprecated Use Pascal Case Instead */
    external = "external",
    /** @deprecated Use Pascal Case Instead */
    inactive = "inactive",
    /** @deprecated Use Pascal Case Instead */
    issues = "issues",
    /** @deprecated Use Pascal Case Instead */
    missing = "missing",
    /** @deprecated Use Pascal Case Instead */
    mixed = "mixed",
    /** @deprecated Use Pascal Case Instead */
    reserved = "reserved",
    /** @deprecated Use Pascal Case Instead */
    notrunning = "notrunning",
    /** @deprecated Use Pascal Case Instead */
    sleep = "sleep",
    /** @deprecated Use Pascal Case Instead */
    standby = "standby",
    /** @deprecated Use Pascal Case Instead */
    suspended = "suspended",
    /** @deprecated Use Pascal Case Instead */
    testing = "testing",
    /** @deprecated Use Pascal Case Instead */
    undefined = "undefined",
    /** @deprecated Use Pascal Case Instead */
    unknown = "unknown",
    /** @deprecated Use Pascal Case Instead */
    unmanaged = "unmanaged",
    /** @deprecated Use Pascal Case Instead */
    unplugged = "unplugged",
    /** @deprecated Use Pascal Case Instead */
    unreachable = "unreachable",
    /** @deprecated Use Pascal Case Instead */
    up = "up",
    /** @deprecated Use Pascal Case Instead */
    used = "used",
    /** @deprecated Use Pascal Case Instead */
    warning = "warning",


    Acknowledged = "acknowledged",
    Critical = "critical",
    Disabled = "disabled",
    Down = "down",
    External = "external",
    Inactive = "inactive",
    Issues = "issues",
    Missing = "missing",
    Mixed = "mixed",
    Reserved = "reserved",
    NotRunning = "notrunning",
    Shutdown = "shutdown",
    Sleep = "sleep",
    Standby = "standby",
    Suspended = "suspended",
    Testing = "testing",
    Transient = "transient",
    Undefined = "undefined",
    Unknown = "unknown",
    Unmanaged = "unmanaged",
    Unplugged = "unplugged",
    Unreachable = "unreachable",
    Up = "up",
    Used = "used",
    Warning = "warning",
}

export enum IconSeverity {
    CriticalInverse = "severity_critical-inverse",
    Critical = "severity_critical",
    Error = "severity_error",
    InfoInverse = "severity_info-inverse",
    Info = "severity_info",
    Ok = "severity_ok",
    Tip = "severity_tip",
    Unknown = "severity_unknown",
    WarningInverse = "severity_warning-inverse",
    Warning = "severity_warning",
}

export enum IconState {
    Hidden = "state_hidden",
    Ok = "state_ok",
    Paused = "state_paused",
    Restarting = "state_restarting",
    Running = "state_running",
    Shutdown = "state_shutdown",
    Sleeping = "state_sleeping",
    Stopped = "state_stopped",
    Unknown = "state_unknown",
    Unmanaged = "state_unmanaged",
    Unplugged = "state_unplugged",
    Visible = "state_visible",
    Lock = "state_lock",
    Unlock = "state_unlock",
}

export enum IconWidget {
    Chart = "widget_chart",
    Dashboard = "widget_dashboard",
    Gauge = "widget_gauge",
    List = "widget_list",
    Map = "widget_map",
    Other = "widget_other",
    PieChart = "widget_pie-chart",
    Summary = "widget_summary",
    Table = "widget_table",
    Tree = "widget_tree",
}
