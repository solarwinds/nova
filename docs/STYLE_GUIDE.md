# Style Guide

In this guide, we try to point out conventions, pattern preferences, and other design choices that are 
important to us. If you can't find a preference here regarding a question you may have about these types 
of things, please refer to the Google style guides [here](https://google.github.io/styleguide/). If
neither place has the answer or you just want to say "Hi", please feel free to email us at 
nova-ui@solarwinds.com with any questions.

## Component development
  * Library components have to work in OnPush change detection mode
Why? We have no control over user environment and change detection strategy is subject to consumer's freedom of choice. Therefore we need to make sure that components we provide work under both, where ChangeDetectionStrategy.OnPush is stricter than Default, so we need to support OnPush.
  * Add an explanatory inline comment to every usage of setTimeout() (and other situations when code is not self-explanatory)
Why? setTimeout is tied to a wider context of executed code, which might not be apparent from reading the code. Documenting the setTimeout usage helps to understand that context.
  * Be aware that the following ResizeObserver polyfill usage does not work in Firefox:
    ```js
    this.resizeObserver.observe(this.el.nativeElement);
    ```
	But the following works in all major browsers:
    ```js
    this.ngZone.runOutsideAngular(() => {
        this.resizeObserver.observe(this.el.nativeElement);
    });
    ```
The reason for this is that, since in Firefox ResizeObserver is not native (as of July 2019), it isn't "hacked" by ZoneJS, so it needs to be explicitly executed outside of Angular.

## HTML Formatting

### Line Wrapping

When wrapping attributes please put the first attribute on the same line as the opening element tag, and put the closing bracket of the opening element on the same
line as the last attribute:

<em>Not Preferred</em>

```html
<div 
     id="my-id"
     class="my-class"
>
</div>
```

<em>Preferred</em>

```html
<div id="my-id"
     class="my-class">
</div>
```

## Typescript Conventions

### Naming

#### Field Names

Private fields are written in `camelCase` and typically should not contain an underscore. If, however, a private field has an associated setter and/or getter, it should be prefixed with an underscore. For example, `_privateFieldWithAccessor`.

## ngOnDestroy and Component Inheritance

A little known fact about Angular and component inheritance is that calls to ngOnDestroy do not automatically get propagated to base classes. This can lead to memory leaks if a derived class implements ngOnDestroy and its base class unsubscribes from one or more observables in its own ngOnDestroy implementation for example.
    
As a safe guard, if you find yourself extending a component from a base class, it's best to go ahead and implement an ngOnDestroy in both the base class and the derived class. Then, in the derived class call super.ngOnDestroy(). This will ensure that any observables added to the base class at a later date will be unsubscribed.

Base:
```js
public ngOnDestroy() {​​​​​​​​​​
// Added as a safeguard. Inherited classes will invoke this
// so that any observables added to this base class will
// be unsubscribed.
}​​​​​​​​​​
```
Derived:
```js
public ngOnDestroy() {​​​​​​​​​​
// Added as a safeguard. Invoking the base class ngOnDestroy
// ensures that any base class observables are unsubscribed.
super.ngOnDestroy();
}​​​​​​​​​​
```

## Documentation
1. Put example data at the bottom of examples
    Why? To avoid scrolling after opening the example source code, put all the mocked data at the bottom of the example. [This example](https://github.com/solarwinds/nova/blob/main/packages/charts/examples/components/demo/chart-types/line/line-chart-basic/line-chart-basic.example.component.ts#L41-L68) shows how we do this.
2. Define a route for every example
    Why? This is useful not only for running tests, but especially for debugging and discovering problems in examples throwing errors to the console. Limiting the amount of code executed on the page to a single example tremendously helps with setting breakpoints. Check [this example](https://github.com/solarwinds/nova/blob/main/packages/charts/examples/components/demo/chart-types/line/chart-docs-line.module.ts#L22-L100) to see how we do this.
3. Use fixed data for the examples.
    Why? Because we have a goal to visually test all the examples in the documentation, we need them to be predictable. For that reason please avoid using randomized data (or any unpredictable elements) in your documentation examples.

## Internationalization
Basic summary:
1. Make sure to make any text with variables/placeholders readable for less technical person (calling "humanize" is not understandable).
2. If a function call is needed within the text inside a template, ensure that the name is simple and self-documenting (for a person not familiar with the code) or add a comment for the translator
3. Because many languages have complicated rules, it's important to provide context around variables to ensure that the translator is able to use the correct form, gender, ordering of words, etc.
4. Translators have tools which (as long as we are using standard form) ensure they don't accidentally change variables
5. Its good to replace numbers with placeholders in messages containing validations and similar things as these numbers change with time and would need unnecessary change in translated texts.

## Testing
### `setTimeout`, `setInterval` and `requestAnimationFrame`'s  testability

When you are using timeouts or intervals for animations or countdowns, protractor tests can fail with a timeout.
Protractor has a built-in feature in which it waits for Angular events to finish before proceeding. The methods listed above will hold the process, and protractor will not continue the test flow until they finish.

To avoid this situation, replace code like:
`setTimeout(() => callback(), timeOut);`
with the following solution which allows protractor to run asserts and continue testing while a timeout is in progress:

```js
ngZone.runOutsideAngular(() => {​​​​
  // running timeout outside of angular zone
  setTimeout(() => {​​​​
    ngZone.run(() => {​​​​
      // callback function should be executed in zone to preserve the angular change detection
      callback();
    }​​​​);
  }​​​​, timeOut);
}​​​​);
```

### Top 10 E2E Guidelines
  1. Do not operate with ElementFinder or ElementFinderArray in you test.
  2. Do not return ElementFinder or ElementFinderArray from the atom.
  3. Build test pages that give a tester full control over the input data (configuration) and full access to the output verification.
  4. Build page objects for test pages. Think of them as a page level atom classes.
  5. Use properties, not functions to retrieve child elements in your atom. As atom encapsulates one single component instance it should return the same sub-component in it's structure. No need to   search for it every time. Use public properties for child atoms and private properties for internal ElementFinders.
  6. Remember your root element. No need to call getElement() function every time.
  7. Return promises from atom methods. Avoid return await doSomething(); . Tester should await it himself.
  8. Do not return childElements as array of Atoms. To build it you will need to iterate through entire set of elements. Tester will need to do it too.
  9. Return childElementsCount():Promise<number> and getChildElement(id or index):Atom. If tester will need to iterate through all of them he will retrieve every DOM element just once. Also consider methods like getChildTexts():Promise<string[]> , getChildValues():Promise<number[]> etc.
  10. Test your atoms. Don't hesitate to write a test that will check that atom works when it should and doesn't work when it shouldn't.
