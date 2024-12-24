# Comparison of End-to-End Testing Frameworks as Protractor Replacements

Protractor has been deprecated, and developers are seeking alternative
end-to-end testing frameworks to ensure reliable testing of web applications.
Below is a comparison of popular e2e testing frameworks based on their pros and
cons.

## Comparison Table

| Framework       | Pros                                                                 | Cons                                                           |
|-----------------|----------------------------------------------------------------------|----------------------------------------------------------------|
| **Cypress**     | - Easy setup and intuitive API                                       | - Limited cross-browser support (no support for Safari or IE)  |
|                 | - Excellent debugging tools with real-time reloading                 | - High memory consumption for large-scale tests                |
|                 | - Built-in features for visual testing and inspecting test execution | - Limited scalability for complex, multi-browser environments  |
| **Nightwatch**  | - Full Selenium WebDriver support                                    | - Outdated documentation and smaller community                 |
|                 | - Supports a11y testing with accessibility tools                     | - Slower updates compared to newer frameworks                  |
|                 | - Cross-browser testing capabilities                                 | - Requires more configuration for advanced features            |
| **WebdriverIO** | - Versatile with support for both Selenium and Chromium-based tools  | - Steeper learning curve for beginners                         |
|                 | - Extensive plugin ecosystem for customization                       | - Slightly slower execution compared to lightweight frameworks |
|                 | - Built-in support for a11y and visual regression testing            | - Debugging can be more complex                                |
| **Puppeteer**   | - Headless browser testing with excellent performance                | - Limited to Chromium-based browsers                           |
|                 | - Simple and fast setup                                              | - Lacks built-in support for cross-browser testing             |
|                 | - Great for visual regression testing                                | - Limited community compared to Selenium                       |
| **Playwright**  | - Cross-browser support (Chromium, Firefox, WebKit)                  | - Steeper learning curve compared to simpler frameworks        |
|                 | - Powerful API for modern testing needs                              | - Requires more boilerplate for simple tests                   |
|                 | - Supports a11y testing and robust visual testing features           | - Comparatively newer, smaller community than Selenium         |

## Summary

Each framework has its strengths and weaknesses, and the choice largely depends
on the specific requirements of your project. Additionally, Protractor users
should consider frameworks that support maintaining an abstraction level similar
to Protractor’s page objects or atoms. This abstraction helps in organizing test
code effectively and enhancing reusability.

- Cypress is ideal for developers looking for simplicity and an excellent user
experience but lacks comprehensive browser support.
- Nightwatch is a good option
for developers familiar with Selenium and needing cross-browser support.
- WebdriverIO offers versatility and extensibility with strong support for
accessibility and visual testing.
- Puppeteer is lightweight and
Chromium-specific, with great visual regression capabilities.
- Playwright is great for modern applications with a need for cross-browser, accessibility, and
visual testing.

### Note
To reduce amount of the code to rewrite we should also consider the [Atoms](./E2E_TEST_ATOMS.md)
which we do have implemented in bits/charts/dashboard and support for the jasmine
