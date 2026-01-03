# React Native Native Setup Guide

## Problem
The project is missing `android/` and `ios/` folders required to run the React Native app.

## Why This Happened
The initial project setup focused on:
- TypeScript code structure
- Business logic and models
- State management (Redux)
- Screen components

But didn't include native platform initialization.

## Solution: Initialize Native Folders

### Step 1: Backup Current Code
```bash
# Create a backup of source code
mkdir -p ../borumithra-backup
cp -r src ../borumithra-backup/
cp -r *.md ../borumithra-backup/
cp package.json ../borumithra-backup/
cp tsconfig.json ../borumithra-backup/
cp babel.config.js ../borumithra-backup/
cp App.tsx ../borumithra-backup/
```

### Step 2: Initialize React Native Project

You have two options:

#### Option A: Using React Native CLI (Recommended for this project)

```bash
# Install React Native CLI globally (if not already installed)
npm install -g react-native-cli

# Initialize a new React Native project with the same name
npx react-native init BorumithraMobile --version 0.73.2

# This will create:
# - android/ folder
# - ios/ folder
# - Default App.tsx and files
```

#### Option B: Manual Template Copy

```bash
# Use React Native community template
npx @react-native-community/cli init BorumithraMobile --template react-native-template-typescript
```

### Step 3: Restore Your Code

After initialization:

```bash
# Copy your source code back
rm -rf BorumithraMobile/App.tsx
cp -r ../borumithra-backup/src BorumithraMobile/
cp ../borumithra-backup/App.tsx BorumithraMobile/
cp ../borumithra-backup/package.json BorumithraMobile/ (merge dependencies)
cp ../borumithra-backup/tsconfig.json BorumithraMobile/
cp ../borumithra-backup/babel.config.js BorumithraMobile/
cp ../borumithra-backup/*.md BorumithraMobile/
```

### Step 4: Install Dependencies

```bash
cd BorumithraMobile

# Install npm packages
npm install

# For iOS (Mac only)
cd ios
pod install
cd ..
```

### Step 5: Configure Native Modules

#### A. Firebase Configuration

**Android** (`android/build.gradle`):
```gradle
buildscript {
    dependencies {
        classpath('com.google.gms:google-services:4.4.0')
    }
}
```

**Android** (`android/app/build.gradle`):
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
}
```

**iOS** (`ios/Podfile`):
```ruby
platform :ios, '13.0'

# Add Firebase pods
pod 'Firebase', :modular_headers => true
pod 'FirebaseCore', :modular_headers => true
pod 'GoogleUtilities', :modular_headers => true
```

#### B. React Native Maps

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<application>
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
</application>
```

**iOS** - Add to `Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show motor locations</string>
```

#### C. Permissions

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

**iOS** (`ios/BorumithraMobile/Info.plist`):
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture motor photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location</string>
```

### Step 6: Link Native Modules

```bash
# For React Native 0.73.2, most modules auto-link
# But you may need to link some manually

# Check linking
npx react-native doctor

# If issues, try:
cd ios && pod install && cd ..
```

### Step 7: Run the App

```bash
# Start Metro bundler
npm start

# In a new terminal - Android
npm run android

# Or iOS (Mac only)
npm run ios
```

## Alternative: Use Expo (Not Recommended for This Project)

Why NOT recommended:
- You're using native modules (Firebase, Maps, Razorpay)
- Expo Managed Workflow doesn't support all these
- Would require Expo bare workflow (which creates android/ios anyway)

## Complete Setup Script

I'll create a setup script for you:
