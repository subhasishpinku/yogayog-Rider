# BA Mart APK — Reverse-engineering summary

## Identity

- App label: **BA Mart**
- Branding text: **BA e-Mart — One App, Multiple Services**
- Android package: `com.bamart.app`
- Version name: `1.0.0`
- Version code: `16`
- Framework: **Flutter** (Dart AOT snapshot in `lib/arm64-v8a/libapp.so`)
- Main activity: `com.bamart.app.MainActivity`

## What the app appears to be

This is a BA Mart / e-commerce-style customer app. The APK contains Flutter splash/no-internet assets and a WebView-based page implementation. The main application appears to open a web application rather than containing all shopping screens as ordinary Android layouts.

Observed URLs/routes:

- `https://cgdemo.sbs/ba-mart-crm/ba-mart-app/`
- `https://cgdemo.sbs/ba-mart-crm/ba-mart-app/customer/login`
- route strings include `customer/login` and `customer/reset-password`

Observed Dart source package names:

- `package:ba_mart/main.dart`
- `package:ba_mart/splash_screen.dart`
- `package:ba_mart/webview_page.dart`
- `package:ba_mart/no_internet_page.dart`
- `package:ba_mart/deep_link_service.dart`

## Declared permissions/features

The manifest declares internet/network state, coarse/fine location, camera/autofocus, phone calls, audio recording, media/image/video and external-storage access. It also declares WebView/deep-link related components and an Android FileProvider.

## Important limitation

The original Dart/Flutter source is not stored in the APK. Flutter release builds contain a compiled Dart AOT snapshot, so exact original `.dart` files, variable names and project structure cannot be recovered reliably. The extracted `_apk_analysis` directory contains the APK contents and assets for further inspection.

## Recovered assets

- `assets/flutter_assets/assets/splash.png`
- `assets/flutter_assets/assets/logo.png`
- `assets/flutter_assets/assets/icon.png`
- offline/error illustration assets

