# Data Sources

A data source is a specific type of provider that retrieves data from an arbitrary source. It is, by
design, a passive class that has to be invoked by an adapter. A data source is a special
entity that plays a specific role in the dashboard ecosystem. As a result, we need to use an
injection token called [`DATA_SOURCE`](../../miscellaneous/variables.html#DATA_SOURCE) to give various
participants the ability to receive a data source by dependency injection. This is necessary in adapters
and widget components that need to register their filters with data sources. The advantage of this design
is that it's relatively easy to implement a widget with multiple data sources (as in the KPI widget) or
with no data source at all.

While the mechanism by which the framework interacts with a data source is [well-defined](../../Interfaces/IDataSource.html), the way in which
a data source retrieves and manipulates its data is left entirely to author of the data source (i.e. the product/feature developer).

It is highly recommended to implement the data source on top of the [DataSourceService](https://ux.solarwinds.io/nova/docs/nova-bits/latest/sdk/api-docs-ng2/injectables/DataSourceService.html#source) so that you extend the service,
that will allow Nova to introduce new functionality to the data source so that you won't need to add that.

## Data Source Features
Data Source Features is way to describe the capabilities of a data source. For example, you can set up the data source
so that it can sort the data and reflect this set up in the configuration. That will allow some parts of the application working
with the Features.

Data Source Features are implemented using [IDataSourceFeaturesConfiguration](https://ux.solarwinds.io/nova/docs/nova-bits/latest/sdk/api-docs-ng2/interfaces/IDataSourceFeaturesConfiguration.html) which is used in [IDataSource](https://ux.solarwinds.io/nova/docs/nova-bits/latest/sdk/api-docs-ng2/interfaces/IDataSource.html).

The example of the features configuration:
```
const supportedFeatures: IDataSourceFeatures = {
    search: { enabled: true },
    pagination: { enabled: true },
};
```

It is highly recommended to use [DataSourceFeatures](https://ux.solarwinds.io/nova/docs/nova-bits/latest/sdk/api-docs-ng2/classes/DataSourceFeatures.html) for the actual implementation of the Features.

You can check the example of GoogleBooks API [DataSource](../widget-types/table/table-with-search.html) in the example.


Currently supported Features by Nova:
- Search ([Table Widget](../widget-types/table/table-with-search.html))

Planned support:
- TBD

## Adapters

An adapter is another specialized type of a provider, whose purpose is to invoke a data source, wait for
the result, and assign it to the right component. This provider type was introduced for the following
reasons:
- To maintain the pure nature of a widget that accepts all data via component inputs thereby respecting
one-way data binding.
- To separate responsibilities between the data source, the component that displays the data, and the
bridge between them.

The basic implementation is called
[`NOVA_DATASOURCE_ADAPTER`](../../miscellaneous/variables.html#NOVA_DATASOURCE_ADAPTER), and it invokes a
data source whenever the [`REFRESH`](../../miscellaneous/variables.html#REFRESH) event is received on the
pizzagna event bus and passes the result to a component property path specified in the adapter's properties.
```
...
"providers": {
    "adapter": {
        "providerId": NOVA_DATASOURCE_ADAPTER,
        "properties": {
            "componentId": "chart",
            "propertyPath": "widgetData",
        },
    },
},
...
```

