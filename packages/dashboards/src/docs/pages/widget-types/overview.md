# Available Widget Types

-   [KPI](./widget-types/kpi.html)
-   [Proportional](./widget-types/proportional.html)
-   [Table](./widget-types/table.html)
-   [Timeseries](./widget-types/timeseries.html)
-   [Embedded Content](./widget-types/embedded-content.html)

## Widget Structure Overview

Every widget contains its own specifics, but there are parts and architectural ideas that are shared
among all widgets. This section will describe these shared concepts in greater detail.

### Layouts

The widgets consist of components that are assembled in a dynamic way. Some components are feature rich
while others, such as
<a href="../components/StackComponent.html" target="_blank">`StackComponent`</a> and
<a href="../components/TilesComponent.html" target="_blank">`TilesComponent`</a> just help organize the
layout of components contained inside them.

```
[DEFAULT_PIZZAGNA_ROOT]: {
    id: DEFAULT_PIZZAGNA_ROOT,
    // base layout of the widget - all components referenced herein will be stacked in a column
    componentType: StackComponent.lateLoadKey,
    properties: {
        // StackComponent can layout contents in a row or column. Default is 'column'.
        direction: "column",
        nodes: [
            // these values reference other components in this configuration
            "header", // <--
            "table", // <--
        ],
    },
},
header: { // <--
},
table: { // <--
}
...
```

### Header

The <a href="../components/WidgetHeaderComponent.html" target="_blank">widget header</a> is a component
included at the top of every widget that displays the widget title, subtitle and widget-related
controls such as edit and removal.

### Event Proxy

Every dashboard instance has an event bus that serves as a central communication channel for all
dashboard sub-components. The same is true for every widget as well since each is composed of individual
components that need to communicate via a broadcast model. Having two types of independent event buses
with separate communication channels brings the necessity to connect them and relay events from one to
another.

<a href="../injectables/WidgetToDashboardEventProxyService.html" target="_blank">`WidgetToDashboardEventProxyService`</a>
is a special type type of provider that transmits selected events from widget to dashboard and vice
versa.

In an example scenario of refreshing the whole dashboard by an external impulse, the event proxy must be
configured to transmit the
<a href="../miscellaneous/variables.html#REFRESH" target="_blank">`REFRESH`</a> event from the dashboard
down to the widget by adding the event to the
<a href="../interfaces/IWidgetToDashboardEventProxyConfiguration.html#downstreams" target="_blank">`downstreams`</a>
array property. On the other hand, sending a widget event to the dashboard can be configured using the
<a href="../interfaces/IWidgetToDashboardEventProxyConfiguration.html#upstreams" target="_blank">`upstreams`</a>
property.

```
[WellKnownProviders.EventProxy]: {
    providerId: NOVA_DASHBOARD_EVENT_PROXY,
    properties: {
        downstreams: [REFRESH],
    },
},
```

### Data Source

A data source is a provider, whose primary purpose is to retrieve data from a remote locations. It's a
passive entity that must be invoked by the `adapter`, see below.  
In the provider/injector environment, it's represented by the
<a href="../miscellaneous/variables.html#DATA_SOURCE" target="_blank">`DATA_SOURCE`</a> injection token.
To provide your own data source, register it under this token using the
<a href="../injectables/ProviderRegistryService.html" target="_blank">`ProviderRegistryService`</a>.

### Adapter

An adapter or, more specifically, a data source adapter is a provider that responds to the
<a href="../miscellaneous/variables.html#REFRESH" target="_blank">`REFRESH`</a> event with the following
actions:

1. Invokes the data source
2. Retrieves data from the data source
3. Assigns the retrieved data to the configured widget component

A widget typically has a specialized adapter that assigns data to the widget in a specific way. Some
adapters might even include some post-processing logic that transforms data retrieved from the data
source before it gets assigned to the widget. For examples of adapter configuration check the widget
schemas of the individual widgets linked at the top of the page.

### Refresher

The <a href="../miscellaneous/variables.html#REFRESH" target="_blank">`REFRESH`</a> event might come from
any source. Whoever feels like it can initialize a data source reload. It can come from an external
source, e.g. some entity outside of the dashboard might decide that it's time to refresh all the widgets.
It might even be a button or menu item on the widget itself. None of that is being presumed and the only
entity that comes built-in is a
<a href="../classes/Refresher.html" target="_blank">`refresher`</a> that emits the
<a href="../miscellaneous/variables.html#REFRESH" target="_blank">`REFRESH`</a> event once every
configured number of seconds, which causes the widget to be refreshed at that interval.

```
[WellKnownProviders.Refresher]: {
    providerId: NOVA_DATASOURCE_INTERVAL_REFRESHER,
    properties: {
        // enable the refresher
        enabled: true,
        // set the refresh interval to 1 minute
        interval: 60,
    } as IRefresherProperties,
} as IProviderConfiguration,
```
