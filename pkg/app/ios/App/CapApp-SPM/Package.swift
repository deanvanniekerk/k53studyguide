// swift-tools-version: 6.1
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v16)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.5.2"),
        .package(name: "CapacitorFirebaseAnalytics", path: "../../../../../node_modules/.pnpm/@capacitor-firebase+analytics@8.5.2_@capacitor+core@8.5.2_firebase@12.19.0/node_modules/@capacitor-firebase/analytics", traits: ["Analytics"]),
        .package(name: "CapacitorFirebaseCrashlytics", path: "../../../../../node_modules/.pnpm/@capacitor-firebase+crashlytics@8.5.2_@capacitor+core@8.5.2_firebase@12.19.0/node_modules/@capacitor-firebase/crashlytics"),
        .package(name: "CapacitorApp", path: "../../../../../node_modules/.pnpm/@capacitor+app@8.1.2_@capacitor+core@8.5.2/node_modules/@capacitor/app"),
        .package(name: "CapacitorBrowser", path: "../../../../../node_modules/.pnpm/@capacitor+browser@8.0.5_@capacitor+core@8.5.2/node_modules/@capacitor/browser"),
        .package(name: "CapacitorDevice", path: "../../../../../node_modules/.pnpm/@capacitor+device@8.0.3_@capacitor+core@8.5.2/node_modules/@capacitor/device"),
        .package(name: "CapacitorPreferences", path: "../../../../../node_modules/.pnpm/@capacitor+preferences@8.0.1_@capacitor+core@8.5.2/node_modules/@capacitor/preferences"),
        .package(name: "CapawesomeCapacitorAppReview", path: "../../../../../node_modules/.pnpm/@capawesome+capacitor-app-review@8.1.0_@capacitor+core@8.5.2/node_modules/@capawesome/capacitor-app-review"),
        .package(name: "RevenuecatPurchasesCapacitor", path: "../../../../../node_modules/.pnpm/@revenuecat+purchases-capacitor@13.7.0_@capacitor+core@8.5.2/node_modules/@revenuecat/purchases-capacitor")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorFirebaseAnalytics", package: "CapacitorFirebaseAnalytics"),
                .product(name: "CapacitorFirebaseCrashlytics", package: "CapacitorFirebaseCrashlytics"),
                .product(name: "CapacitorApp", package: "CapacitorApp"),
                .product(name: "CapacitorBrowser", package: "CapacitorBrowser"),
                .product(name: "CapacitorDevice", package: "CapacitorDevice"),
                .product(name: "CapacitorPreferences", package: "CapacitorPreferences"),
                .product(name: "CapawesomeCapacitorAppReview", package: "CapawesomeCapacitorAppReview"),
                .product(name: "RevenuecatPurchasesCapacitor", package: "RevenuecatPurchasesCapacitor")
            ]
        )
    ]
)
