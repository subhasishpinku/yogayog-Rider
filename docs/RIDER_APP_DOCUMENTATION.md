# YogaYog Rider App Documentation

Version: 1.0.0  
Last reviewed: 24 October 2026

## 1. Product overview

YogaYog Rider is a portrait-mode Expo/React Native mobile application for delivery riders and truck drivers. It provides rider authentication, onboarding and KYC collection, delivery acceptance, active-delivery tracking, COD collection, failed-delivery reporting, earnings, profile management, and logout.

The current repository is a UI-first implementation. Authentication and rider registration are connected to the YogaYog API; most delivery, earnings, profile, payment, and document-management screens currently use local state and sample data.

## 2. Technology and project structure

| Area | Current implementation |
|---|---|
| Framework | Expo SDK 55, React Native 0.83, React 19 |
| Language | JavaScript screens plus a TypeScript `App.tsx` entry point |
| Navigation | React Navigation native stack; route constants are in `app/constants/navigationStrings.js` |
| HTTP client | Axios |
| Authentication storage | `@react-native-async-storage/async-storage` |
| Maps | `react-native-maps` with Google Maps provider |
| Location | `expo-location`, foreground tracking only |
| Images/documents | `expo-image-picker` |
| OCR | `expo-ocr-kit` for PAN, Aadhaar, and driving-licence image checks during registration |
| Date selection | `@react-native-community/datetimepicker` |
| Animation/UI | React Native Animated, Reanimated dependency, Expo Status Bar/Navigation Bar |
| JavaScript engine | Hermes |

Important directories:

- `app/`: screens, navigation, context, constants, and styles.
- `app/contexts/AuthContext.js`: authentication, registration, token persistence, and logout.
- `app/Navigation/HomeStack.js`: the complete native-stack route registry.
- `assets/`: application icons, logos, splash assets, and rider imagery.
- `plugins/`: Expo config plugins.
- `android/`: generated/native Android project currently present in the repository.

## 3. Application startup and authentication

1. `App.tsx` mounts `AuthProvider`, `NavigationContainer`, and `HomeStack`.
2. The splash screen runs a five-second brand animation.
3. `AuthContext` restores `authToken` from AsyncStorage.
4. The user is routed to the dashboard when a token exists; otherwise the login screen is shown.
5. The Android navigation bar is hidden and the status bar is hidden globally by the root app.

### Login fields

| Field | Internal name | Rules/behavior |
|---|---|---|
| Rider type | `role` | `bike` or `truck`; selected in the UI and passed to registration/navigation |
| Mobile number | `phone` | Digits are normalized; exactly 10 digits are required; country display is India `+91` |

The login request always sends `login_as: "rider"`. If the API reports that the user was not found, the app opens registration and carries the normalized mobile number and selected role.

### Login OTP verification

| Field | Internal name | Rules |
|---|---|---|
| OTP | `otp` | Four numeric digits |
| Mobile | `mobile` | Normalized 10-digit mobile number from login |

Successful verification requires `success: true` and a response token. The token and returned user object are saved as `authToken` and `authUser` in AsyncStorage.

## 4. Rider registration and field dictionary

Registration is submitted as `multipart/form-data` to `auth/register-rider`. All fields below are required by the current client validation unless stated otherwise.

### Basic details

| UI field | Client state | API field | Format/notes |
|---|---|---|---|
| Full Name | `fullName` | `name` | Trimmed text |
| Primary No | From login route | `mobile` | Digits only; read-only on registration |
| Secondary No | `secondaryPhone` | `sec_mobile` | Digits only; max 10 UI characters |
| Date of Birth | `dateOfBirth` | `dob` | UI accepts `DD/MM/YYYY`; API receives `YYYY-MM-DD`; selectable range is 1 Jan 1940 through today |
| Account Type | `accountType` | `veh_type` | `Bike` or `Truck` |
| Email | `email` | `email` | Email input; must be verified before account creation |
| Email OTP | `emailOtp` | Used by verification endpoint | Six numeric digits |
| Terms acceptance | `acceptedTerms` | Not sent as a named field | Must be true; only enabled after email verification |

### Address details

| UI field | Client state | API field | Format/notes |
|---|---|---|---|
| Pin Code | `pincode` | `pincode` | Six-digit numeric input in the UI |
| City | `city` | `city` | Text |
| State | `state` | `state` | Text |
| Address | `address` | `address` | Multiline text |

### Bank and payout details

| UI field | Client state | API field | Format/notes |
|---|---|---|---|
| Bank Account Number | `bankAccountNumber` | `ac_numb` | Numeric input |
| IFSC Code | `bankIfscCode` | `ifsc_c` | Converted to uppercase |
| Secondary Account Number | `secondaryAccountNumber` | `second_acc` | Numeric input |
| Secondary IFSC Code | `secondaryIfscCode` | `second_ifsc` | Converted to uppercase |
| UPI ID | `upiId` | `upi` | Text/email-style input |

### Vehicle and identity details

| UI field | Client state | API field | Format/notes |
|---|---|---|---|
| Vehicle Number | `vehicleNumber` | `veh_number` | Uppercase-style vehicle input |
| Driving Licence Number | `drivingLicenceNumber` | `dl_no` | Converted to uppercase |
| PAN Number | `panNumber` | `pan_no` | Max 10 UI characters; converted to uppercase |
| Aadhaar Number | `aadhaarNumber` | `aadhar_no` | Max 12 numeric characters |

### Registration image fields

| UI field | Client state | Multipart field | Source and validation |
|---|---|---|---|
| Profile photo | `profileImage` | `profile_pic` | Gallery picker in the registration screen |
| Driving licence image | `drivingLicenceImage` | `dl_pic` | Gallery or camera; OCR checks licence-like text/pattern |
| PAN image | `panImage` | `pan_pic` | Gallery or camera; OCR checks a PAN pattern |
| Aadhaar image | `aadhaarImage` | `aadaar_pic` | Gallery or camera; OCR checks for a 12-digit number |

The client creates file names from the field name and extension and sends JPEG/PNG MIME types. Empty values are omitted from the FormData object.

## 5. API reference

Base URL configured in `app/contexts/axiosInstance.js`:

`https://courier.yogayog.net/api/`

| Method | Endpoint | Request body | Expected client behavior |
|---|---|---|---|
| POST | `auth/send-otp` | `{ login_as: "rider", mobile }` | Requires a normalized 10-digit mobile and a successful response |
| POST | `auth/verify-otp` | `{ login_as: "rider", mobile, otp }` | Requires `success` and `token`; persists token/user |
| POST | `mail/send-otp` | `{ email, name }` | Opens email OTP dialog on success |
| POST | `mail/verify-otp` | `{ email, otp }` | Marks email as verified on success |
| POST | `auth/register-rider` | Multipart registration fields and images | Requires `success` and `token`; persists token/user |
| POST | `logout` | No body | Sends `Authorization: Bearer <authToken>`; local auth data is removed even if the request fails |

The current Axios instance sets JSON content type globally. Registration overrides it with `multipart/form-data`.

## 6. Navigation and screen inventory

All registered routes are in `app/Navigation/HomeStack.js`. Headers are hidden at the stack level.

### Entry and account screens

| Screen | Route | Purpose |
|---|---|---|
| Splash | `SplashScreen` | Brand animation and session restoration |
| Login | `LoginScreen` | Select rider type, enter mobile, request OTP |
| OTP verification | `VerifyOtp` | Enter four-digit login OTP and continue |
| Registration | `RegisterScreen` | Capture complete rider profile, documents, and consent |

### Main dashboard tabs

| Tab | Screen | Current content |
|---|---|---|
| Home | `HomeScreen` | Online/offline switch, earnings, deliveries, rating, distance, location card, available order |
| Active | `ActiveScreen` | Active order map, ETA, pickup/drop route, customer contact, delivery completion |
| Earnings | `EarningsScreen` | Balance, period tabs, metrics, weekly chart, withdraw entry point |
| Profile | `ProfileScreen` | Personal, contact, vehicle, bank details, edit profile |

### Operational screens

| Screen | Route | Main function |
|---|---|---|
| Accept/reject order | `AcceptRejectOrder` | Shows pickup/drop map, fare, COD/tag data, countdown, accept/reject actions |
| Active delivery success | `ActiveDelivery` | Shows delivered status, earnings, rider rating, return to dashboard |
| Edit profile | `EditProfileScreen` | Edits personal/contact/bank values locally |
| Withdraw earnings | `WithdrawEarnings` | Amount entry, quick amount buttons, payout account display |
| All Profile/tools | `AllProfileScreen` | Opens KYC, documents, live location, COD, non-delivery, handover, call customer, and logout |

## 7. KYC and document workflows

### KYC verification

`KYCPageVerification` presents three steps:

1. Basic information — marked completed in the current UI.
2. Documents — links to `DocumentsUploadSection`.
3. Selfie verification — opens the camera and asks the rider to hold an Aadhaar card.

The selfie URI is passed to `KYCApproved`, which displays a rider ID, verification date, active status, and a “Start Riding” action. No KYC approval API call is currently implemented.

### Document upload section

The document list currently contains:

- Aadhaar Card — front and back; max 5 MB; shown as uploaded.
- PAN Card — front only; max 5 MB; shown as uploaded.
- Driving Licence — front/back description; shown as under review.
- RC Book (Vehicle) — required; upload action.
- Vehicle Insurance — required; upload action.
- Bank Passbook / Cheque — shown as uploaded.
- Profile Photo — shown as uploaded.

Images are selected from the media library and stored in local screen state. The “Save & Continue” action currently returns to the previous screen; it does not upload these files to the API.

## 8. Delivery and payment workflows

### Order acceptance

The available-order card opens `AcceptRejectOrder`. It displays order ID, estimated fare, pickup/drop addresses, package weight, COD flag, vehicle type, customer name, and an 18-second auto-reject countdown. The current Accept and Reject buttons both return to the previous screen; no order API call is made.

### Active delivery

The active screen displays ETA, current route, customer name/phone, estimated earning, remaining distance, and a “Mark as Delivered” action. The action opens the local delivery-success screen. The map and values are currently sample data.

### COD collection

`CodAmountCollect` shows the COD amount and offers:

- QR payment — opens `QRPayment`, showing a UPI ID and payment status UI.
- Cash — opens `CashCollection`.

Cash collection fields:

- Amount received from customer — numeric input.
- Change to return — calculated as `max(receivedAmount - 250, 0)`.
- Customer signature — tap-to-mark signature placeholder.

The cash confirmation requires the received amount to be at least ₹250, then opens `CollectedCash`. QR completion also opens the collected-cash confirmation. These actions are local UI transitions; no payment gateway or payment-record API is connected.

### COD handover

`CODHandover` shows a six-delivery collected breakdown and accepts:

- Branch staff name — required.
- Amount handed over — numeric field, default ₹2,850.
- Branch staff signature — tap-to-mark placeholder.

Confirmation displays a local alert and returns to the previous screen. No handover API is connected.

## 9. Failed delivery and customer contact

### Non-delivery reasons

The app provides eight selectable reasons:

| Code | Reason |
|---|---|
| A | RTO — Return to Origin |
| B | Address Not Found |
| C | Party Refused |
| D | Reschedule Delivery |
| E | Customer Not at Home |
| F | Refused to Pay COD |
| G | Shipment Damaged |
| H | Returned to Branch |

Reason A/B/E/F/G/H route to `RTODetails`. Reason C routes to `RescheduleDelivery` because of the current route mapping. Reason D currently falls through to `RTODetails`; this is a likely routing defect if D should always open the reschedule screen.

### RTO details

Fields and controls:

- Delivery attempt count: 1, 2, or 3.
- Location proof photo: tap-to-mark proof added; no image picker is connected.
- Additional notes: multiline text.
- Confirm RTO: shows a local confirmation alert.

### Reschedule delivery

Fields and controls:

- New date: Today, Thu 1, Fri 2, Sat 3 (static list).
- Time slot: Morning 9 AM–12 PM, Afternoon 12 PM–4 PM, Evening 4 PM–7 PM.
- Customer note: multiline text.
- Confirm reschedule: shows a local confirmation alert.

### Call customer

The call screen shows the customer identity, phone number, order/location, masked-number notice, mute, end call, speaker, and “Mark Non-Delivery”. The call controls are visual/local state only; no telephony or masked-call provider is connected.

## 10. Live location

`LiveLocationMap` and `LiveLocationShow` request foreground location permission, obtain the current position, and subscribe to position updates. The UI displays a rider marker, destination marker, route polyline, coordinates, GPS state, and navigation/action buttons.

Fallback coordinates are used when permission is denied or location cannot be obtained. The current implementation does not send location updates to the backend and does not implement background location tracking.

Required permissions/configuration:

- Android coarse location.
- Android fine location.
- Android camera permission for document/selfie capture.
- Google Maps API key configured through `app.json` and the `react-native-maps` plugin.

## 11. Profile and earnings fields

### Profile display sections

- Personal information: full name, date of birth, gender, address, city/state, PIN code.
- Contact numbers: primary mobile, alternate mobile, emergency contact, email.
- Vehicle details: vehicle type, registration number, make/model, year, insurance expiry.
- Bank details: account name, bank name, masked account number, IFSC, account type, UPI ID.

### Edit profile fields

- Full name.
- Address line 1.
- City.
- PIN.
- Primary mobile.
- Alternate mobile.
- Email.
- Account number.
- IFSC code.
- UPI ID.

The Save Changes action currently navigates back without persisting the edited values or calling an API.

### Earnings and withdrawal

The earnings UI contains Today/Week/Month filters, total balance, last payout date, today’s earnings, delivery count, average earning per delivery, distance covered, and a weekly bar chart. Withdrawal fields are:

- Withdrawal amount — numeric input, max six characters.
- Quick amount choices — ₹500, ₹1,000, ₹5,000, All.
- Destination account — currently displayed as SBI Savings Account ending in 4821.

The withdrawal button currently has no handler/API integration.

## 12. Local storage and session behavior

| Key | Value |
|---|---|
| `authToken` | API bearer token returned after login or registration |
| `authUser` | JSON-serialized API user object |

Logout calls the API when a token exists, then always removes both keys and marks the context unauthenticated. The app does not currently configure an Axios interceptor to automatically attach the bearer token to ordinary API requests.

## 13. Permissions and device behavior

- Camera permission: registration document photos and KYC selfie.
- Media-library permission: document upload section and registration gallery selection.
- Foreground location permission: live location screens.
- Android navigation bar: hidden during app initialization.
- Status bar: hidden at root; individual screens also set light/dark status styles.
- Orientation: portrait.

## 14. Local development

Prerequisites:

- Node.js and npm.
- Android Studio/Android SDK for local Android builds.
- A configured Google Maps API key for map rendering.
- Access to the configured YogaYog API for authentication/registration testing.

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npx expo start
npx expo start -c
npx expo run:android
npx expo run:ios
npm run web
```

Quality checks:

```bash
npx expo lint
npx tsc --noEmit
npx expo-doctor
```

The repository contains `package-lock.json` and no `bun.lock`, so npm/npx commands are the matching package-manager commands for the current checkout.

## 15. EAS build profiles

`eas.json` defines:

- `development`: development client, internal distribution, Android APK.
- `preview`: internal distribution, Android APK.
- `production`: automatic app-version increment.

Examples:

```bash
npx eas-cli@latest build --platform android --profile development
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform android --profile production
npx eas-cli@latest submit --platform android --profile production
```

## 16. Current implementation gaps and recommended next work

The following items should be completed before production release:

1. Replace hard-coded sample rider, order, customer, location, earnings, bank, and KYC data with API-backed data.
2. Add authenticated API calls for orders, delivery status, location updates, payments, withdrawals, profile edits, documents, RTO, rescheduling, customer calls, and COD handover.
3. Attach the bearer token consistently to authenticated requests and handle token expiry.
4. Upload and persist files selected in the document-management screen and RTO proof flow.
5. Implement a real signature capture component instead of tap-to-mark placeholders.
6. Integrate a supported payment/UPI confirmation flow rather than a local “Payment Done” button.
7. Add real phone/masked-call integration for customer calls.
8. Add backend-driven date/time slots and non-delivery routing; specifically verify reason C and D mapping.
9. Validate amounts, account numbers, IFSC, UPI, vehicle number, PAN, Aadhaar, and email format more strictly on both client and server.
10. Move Google Maps configuration to restricted environment/build secrets and restrict the key by platform/package/bundle identifier.
11. Add automated tests for authentication, registration validation, OTP handling, payment amount/change calculation, navigation, and permission-denied states.
12. Add privacy policy, partner terms, consent copy, secure logging, and a production data-retention policy for identity documents.

## 17. Source-of-truth files

- Root entry and providers: `App.tsx`
- App metadata and permissions: `app.json`
- Build profiles: `eas.json`
- Dependencies: `package.json`
- Navigation: `app/Navigation/HomeStack.js`
- Route names: `app/constants/navigationStrings.js`
- API base URL: `app/contexts/axiosInstance.js`
- Authentication and registration API logic: `app/contexts/AuthContext.js`
- Registration UI and field mapping: `app/RegisterScreen/RegisterScreen.js`

