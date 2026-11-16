# Birthday Calendar — Website

Marketing site for **Birthday Calendar**, the Android app by RD Apps that syncs
birthdays from a Facebook account and lets you wish friends and family in a single tap.

Live site: <https://rajdeepvaghela.github.io/BirthdayCalendar/>

## Stack

Plain HTML, CSS and vanilla JavaScript — no build step, no dependencies.
GitHub Actions publishes the repository root to GitHub Pages.

```
index.html                 # single page
assets/css/styles.css      # design tokens, layout, components
assets/js/main.js          # theme, menu, tabs, lightbox, scroll-spy, confetti
assets/img/                # app icon, screenshots, Wear OS tiles
```

## The download button

The primary call to action points at the **latest GitHub release** of this repository:

```
https://github.com/rajdeepvaghela/BirthdayCalendar/releases/latest/download/birthday-calendar.apk
```

`releases/latest/download/<asset>` always resolves to the newest published release,
so publishing a new release updates the site with no code change.

> **Release requirement:** every release must contain an asset named exactly
> `birthday-calendar.apk`. If you publish a differently named file the button 404s.
>
> ```bash
> gh release create v1.2.0 app-release.apk \
>   --title "Birthday Calendar v1.2.0" \
>   --notes "What's new"
> ```

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static file server works. Opening `index.html` directly from disk also works,
but a local server is closer to how the site is deployed.

## Content sources

App details, feature descriptions, permissions and the privacy statement come from
the archived Google Play listing for `com.rdapps.fbbirthdayfetcher` (May 2024 capture).
The live Play listing has since been removed, so the site links to the archived copy.

Screenshots in `assets/img/` are cropped from the Play listing artwork at full
resolution (1644×2924 for phone, 454×454 for Wear OS).

## Privacy claim

The app declares no data collected and no data shared with third parties, and stores
birthdays locally on the device. The site reflects that wording. Keep the claim
accurate if the app's data handling changes.
