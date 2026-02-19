# Visual Testing with Playwright and Virtual Camera
- [![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/356638da/web/nova-bits) - bits
- [![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/356638da/web/nova-charts) - charts
- [![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/356638da/web/nova-dashboards) - dashboards


This project uses Playwright for visual tests and a thin Virtual Camera API to keep tests clean and portable.

Goals:
- Framework-agnostic test code using Atoms and Helpers
- Centralize visual capture via a Camera (Percy or manual PNGs)
- Stable screenshots (disable animations, consistent widths)

## Setup

- Playwright config at `packages/bits/playwright.config.ts` defines a `visual` project and outputs artifacts to `test-results/`.
- Manual snapshots: set `SNAPSHOTS_UPLOAD=manual` to write PNGs to `_snapshots/`.
- Percy (optional): set `PERCY_TOKEN` in your environment and run via `percy exec`.

## Virtual Camera API

Import from `packages/bits/e2e/virtual-camera`:
- `new Camera().loadFilm(page, testName, suiteName?)` – initialize camera
- `camera.turn.on()` / `camera.turn.off()` – enable/disable lens CSS and configuration
- `camera.say.cheese(label)` – capture a snapshot with an optional stabilization delay
- `camera.be.responsive(widths, callback?)` – set responsive widths and optional callback that receives the Playwright `page`

By default, the Camera engine selects the Percy lens when `process.env.PERCY` is present. Otherwise, with `SNAPSHOTS_UPLOAD=manual`, it saves PNGs.

## Best Practices

- Disable CSS animations for visual runs:
  - `await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS)`
- Interact via Atoms (see `docs/E2E/ATOMS.md`) to keep tests resilient.
- Use meaningful snapshot labels tied to user actions.
- Prefer consistent viewport widths; set `camera.be.responsive([1920])` as needed.

## Example: Busy Visual Test

```ts
import { test, Helpers, Animations } from "../../setup";
import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { Camera } from "../../virtual-camera/Camera";

const name = "Busy";

test.describe(`Visual tests: ${name}`, () => {
  let switchBusyState: ButtonAtom;

  test.beforeEach(async ({ page }) => {
    await Helpers.prepareBrowser("busy/busy-visual-test", page);
    await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);
    switchBusyState = Atom.find<ButtonAtom>(ButtonAtom, "nui-busy-test-button");
  });

  test(`${name} visual test`, async ({ page }) => {
    const camera = new Camera().loadFilm(page, `${name} visual test`, "Bits");
    await camera.turn.on();

    await camera.say.cheese("initial");

    await switchBusyState.click();
    await camera.say.cheese("busy-state");

    await Helpers.switchDarkTheme("on");
    await camera.say.cheese("dark-theme");
    await Helpers.switchDarkTheme("off");

    await camera.turn.off();
  });
});
```

## Running Visual Tests

- Run the visual project:
```powershell
cd packages/bits
yarn e2e:playwright:base --project=visual
```

- With Percy:
```powershell
cd packages/bits
percy exec -- yarn e2e:playwright:base --project=visual
```

Snapshots will appear in CircleCI artifacts or `_snapshots/` when using manual mode.
