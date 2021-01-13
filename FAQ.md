# FAQ

## What is Nova UI?

Nova UI is the collection of design specs and developer tools that define an application's user experience. Nova UI is comprised of:

* [Nova Design System](https://ux.solarwinds.io/design/)
* Nova UI Framework
  * [bits](./packages/bits/README.md)
  * [charts](./packages/charts/README.md)
  * [dashboards](./packages/dashboards/README.md)

## What's the Nova Design System?

The [Nova Design System](https://ux.solarwinds.io/design/) is the specification and guidelines for the Nova User Experience. Think of it as the rules that govern how Nova UI components behave.

## How can I talk to Nova UI developers?

Currently, the best way to communicate with us directly is to send an email to <nova-ui@solarwinds.com>.

## How can I open a Defect/Feature Request for Nova UI?

Please create an issue using the GitHub [issue portal](https://github.com/solarwinds/nova/issues/new/choose).

## What Browsers are supported by Nova UI?

| Browser         | Notes                                |
| -----------     | -----------                          |
| Google Chrome   | last 2 versions at time of release   |
| Mozilla Firefox | last 2 versions at time of release   |
| Microsoft Edge  | last 2 versions at time of release   |
| Safari          | last 2 versions at time of release   |

## What's the best way to provide feedback on APIs?

We'd love to hear your feedback. If you have some, please drop us an email at <nova-ui@solarwinds.com>.

## Where's the API documentation?

API documentation can be found at ux.solarwinds.io/nova/docs, right next to the [Nova Design System](https://ux.solarwinds.io/design).

## Why can't I find certain components in Bits?

If you're aware of any simple, generic, commonly-used UI components that aren't currently in Bits, please contact us at <nova-ui@solarwinds.com>.

After building a previous framework, we learned a lot about how to build components the wrong way. One of the most important lesson we took away – the more complex a component, the less likely that component will be truly generic. The larger the component, the more consumers need to modify pieces of the layout and logic to meet their specific needs. With that previous framework, we tried to build all the special consumer use-cases into our components with many different inputs and a bunch of branching logic. These components quickly became brittle and unmaintainable – and a constant source of blocks to delivery. The most effective way we’ve found to not violate the Open-Closed principle is to not wrap complex layouts inside of generic components. On the down-side, this results in more boilerplate code. But it also solves the Nova-as-a-blocker architecture - and ultimately empowers dev teams to do what they need to do to deliver their features.

Are there other tools we could build to minimize boilerplate? Yes! The services/tooling we provide for filtered views in Bits is a good example. The Nova UI charts and dashboards libraries are other examples. We will continue to provide and refine tools/services/etc that minimize boilerplate. But, we also have to consider Nova UI capacity/staffing. Support for filtered views, charts and dashboards is available because they satisfy common use cases. We have to be more discriminating with functionality that may be used by just a few consumers. If we don’t know how common a feature will be, we wait until we do know.

Finally, we could build an infinite number of increasingly composed (complex) components, up to and including user-facing, full-stack features. At what point is a reusable piece of functionality inappropriate for a simple, generic UI framework?

Our ideas, understanding, and solutions to this problem are always evolving. To that end, we welcome input from consumers and any other stakeholders.

## What does Beta status mean?

If a component is marked as Beta on our API docs it essentially means the following:

* We've built the component to UX specs
* It meets our Definition of Done, including comprehensive automation that's integrated into the build pipeline (unit, e2e and visual tests)
* There are no major outstanding defects (though there could be some minor defects)
* We've had little to no external feedback on the API

So, Beta is not an indication of the quality of the component, but rather an indication that we may have to eventually tweak the API based on new user feedback. However, once a component is marked Beta, we guarantee no API changes will be made until the next major version.

## How do I know what priority my request is given?

When fully staffed, we try to address most defects as quickly as possible. But there are a number of factors that contribute to the calculus of defect priority, including:

* Does the issue affect the user's ability to accomplish something or is it just cosmetic?
* Is there an acceptable work-around?
* Is the related work small or large?
* Does the related work require API breaking changes?
* Other priorities
* Staffing

## Where can I find Nova UI releases/packages?

Nova UI packages are npm packages that reside [here](https://www.npmjs.com/settings/nova-ui/packages). 
