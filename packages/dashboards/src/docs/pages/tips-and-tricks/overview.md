# Tips and Tricks

## Pizzagna Snapshot

To quickly see the state of any component's pizzagna within a dashboard, open the console output in the
browser's dev tools. Then, hold CTRL + SHIFT while clicking the component you want to
examine the pizzagna for. A snapshot of the pizzagna state will appear in the console showing the state 
of the clicked component as well as the states of all its ascendants.

Contained in each component state are the component's ID, type, instance, providers, and properties.

**Note:** This feature is currently only supported on Windows environments.

## Event Logging

While developing a dashboard, if you want to see a trace of all events going across a widget's event bus,
add the `NOVA_EVENT_BUS_DEBUGGER` to the provider index on the widget's pizzagna root. This provider will
output all events on the event bus's stream to the browser's dev tools console.

```json
{
    id: "widgetId",
    type: "kpi",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.EventBusDebugger]: {
                        providerId: NOVA_EVENT_BUS_DEBUGGER
                    },
                    ...
                },
                ...
            },
            ...
        },
        ...
    },
}
```
