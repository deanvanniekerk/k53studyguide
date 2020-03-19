### Capacitor

https://capacitor.ionicframework.com/docs/getting-started/dependencies/
https://capacitor.ionicframework.com/docs/getting-started
https://capacitor.ionicframework.com/docs/basics/workflow

npm run build
npm run sync

### App Versions

#### Android

-   `android/app/build.gradle`
    -   `versionCode: x.x`
    -   `versionName: x.x`

#### OIS

-   `ios/App/App.xcodeproj/project.pbxproj`
    -   `CURRENT_PROJECT_VERSION = x.x;` > 2 places
    -   `MARKETING_VERSION = x.x;` > 2 places

### SVG to React Component

-   `npm run svg-to-component -- assets/resources/ninja/svg-solid/018-katana-1.svg`

### Package version updates

-   `npm install npm-check -g`
-   `npm-check -u -E`
