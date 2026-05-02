# K53 Study Guide

![banner](https://i.ibb.co/g9wC6vb/Feature-Graphic.png)

**K53 Study Guide** guides learners through the process of preparing for the K53 learners license test.

Some of K53 Study Guide features include:

-   The **Study** section: contains all K53 study material and a tracker which logs the sections that have been read through.
-   The **Quiz** section: learners practise by completing test questions, all progress is tracked and indicated by Level.
-   The **Test** section: leaners test their skills by completing mock tests that are set up and marked in the same way as the real one.

K53 Ninja contains a bank of **over 400** tough test questions. Test are **dynamically generated** so learners will never feel like they are repeating tests.

### Listings

-   [Play Store Listing](https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app&hl=en-GB)
-   App Store Listing: Comming Soon!

## Development

### Getting started

-   `pnpm install`
-   `pnpm start`
-   Application should now be available at `http://localhost:3000`

### Testing

-   `pnpm test`

### Linting

-   `pnpm lint`
-   `pnpm lint-fix`

### Bundle Analyzer

-   `pnpm analyze:build`
-   `pnpm analyze:run`

### Package version updates

-   `pnpm update --interactive --latest`

## Updating App Versions

### Android

-   `pkg/app/android/app/build.gradle`
    -   `versionCode: x`
    -   `versionName: x.x`

### IOS

-   `pkg/app/ios/App/App.xcodeproj/project.pbxproj`
    -   `CURRENT_PROJECT_VERSION = x.x;` >
    -   `MARKETING_VERSION = x.x;`

## SVG to React Component Tool

-   `pnpm svg-to-component -- assets/resources/ninja/svg-solid/018-katana-1.svg`
