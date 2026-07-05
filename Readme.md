# K53 Study Guide

![banner](https://i.ibb.co/g9wC6vb/Feature-Graphic.png)

**K53 Study Guide** helps South African learners prepare for the K53 learner's licence test.

Core app features:

- **Study**: K53 study material with progress tracking.
- **Quiz**: practice questions with tracked progress.
- **Test**: mock tests marked like the real exam.

The app includes 500+ practice questions and dynamically generated mock tests.

## License / Use

No license is granted for this repository. The source is public for portfolio/reference review only. All rights are reserved; do not copy, use, modify, redistribute, or reuse any part without written permission.

## Packages

This is a pnpm monorepo with packages under `pkg/*`.

- `pkg/app`: Ionic React + Capacitor mobile app.
- `pkg/lander`: Vite-powered static landing website.

## Listings

- [Google Play](https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app&hl=en)
- App Store: Coming Soon

## Development

Install dependencies:

```bash
pnpm install
```

Run the mobile app locally:

```bash
pnpm start
```

The app dev server runs at `http://localhost:3000`.

Run the landing website locally:

```bash
pnpm start:lander
```

The lander uses Vite's default dev port, usually `http://localhost:5173`.

## Quality Checks

Run tests:

```bash
pnpm test
```

Run lint/type checks:

```bash
pnpm lint
```

Auto-fix formatting and lint issues where possible:

```bash
pnpm lint-fix
```

## Builds

Build the mobile app web bundle:

```bash
pnpm build
```

Build the landing website:

```bash
pnpm --dir pkg/lander exec vite build
```

## Deploy Landing Website

Copy the example env file and add the FTP password locally:

```bash
cp .dev.env.example .dev.env
```

Then edit `.dev.env`:

```bash
FTP_PASSWORD="your-cpanel-ftp-password"
```

Deploy the lander over FTP:

```bash
pnpm deploy:lander
```

The real `.dev.env` file is ignored by git. Commit only `.dev.env.example`.

If the FTP account does not land directly in the website root, set:

```bash
FTP_REMOTE_DIR="public_html"
```

## Capacitor

Sync Android:

```bash
pnpm cap-sync-android
```

Sync iOS:

```bash
pnpm cap-sync-ios
```

Open native projects:

```bash
pnpm cap-open-android
pnpm cap-open-ios
```

## Updating App Versions

Android:

- `pkg/app/android/app/build.gradle`
  - `versionCode`
  - `versionName`

iOS:

- `pkg/app/ios/App/App.xcodeproj/project.pbxproj`
  - `CURRENT_PROJECT_VERSION`
  - `MARKETING_VERSION`

## Bundle Analyzer

```bash
pnpm --filter app analyze:build
pnpm --filter app analyze:run
```

## SVG to React Component Tool

```bash
pnpm --filter app svg-to-component -- assets/resources/driving-school/svg-solid/018-turn-left.svg
```
