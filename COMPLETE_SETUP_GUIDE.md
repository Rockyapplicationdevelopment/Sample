# Complete Setup Guide - Borumithra Mobile

## Overview

This guide will help you set up and run the Borumithra Mobile React Native application from scratch.

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18.x or higher
   ```

2. **npm** (v9 or higher)
   ```bash
   npm --version  # Should be v9.x or higher
   ```

3. **For Android Development:**
   - Java JDK 17
   - Android Studio
   - Android SDK (API Level 34)
   - Android SDK Build Tools 34.0.0

4. **For iOS Development (Mac only):**
   - Xcode 14 or higher
   - CocoaPods
   - Command Line Tools

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd /path/to/borumithra-mobile

# Install npm packages (use legacy-peer-deps for React Native)
npm install --legacy-peer-deps
```

**Expected Output**: Successfully installed 1023 packages

### Step 2: Configure Environment Variables

```bash
# Create .env file from example
cp .env.example .env

# Edit .env file with your credentials
nano .env  # or use your preferred editor
```

Add your Firebase and Razorpay credentials:
```env
FIREBASE_API_KEY=your_actual_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

NODE_ENV=development
```

### Step 3: Configure Firebase (Critical)

#### Android Configuration

1. **Download google-services.json**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings
   - Scroll to "Your apps" section
   - Click on Android app (or add one if not exists)
   - Package name: `com.borumithramobile`
   - Download `google-services.json`

2. **Place the file**
   ```bash
   # Copy google-services.json to:
   cp /path/to/google-services.json android/app/google-services.json
   ```

3. **Update build.gradle**
   
   Edit `android/build.gradle`, add to dependencies:
   ```gradle
   buildscript {
       dependencies {
           classpath('com.android.tools.build:gradle')
           classpath('com.facebook.react:react-native-gradle-plugin')
           classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')
           classpath('com.google.gms:google-services:4.4.0')  // Add this
       }
   }
   ```

   Edit `android/app/build.gradle`, add at the bottom:
   ```gradle
   apply plugin: 'com.google.gms.google-services'  // Add this line
   ```

#### iOS Configuration (Mac only)

1. **Download GoogleService-Info.plist**
   - In Firebase Console
   - Go to Project Settings
   - iOS app section
   - Bundle ID: `org.reactjs.native.example.BorumithraMobile`
   - Download `GoogleService-Info.plist`

2. **Add to Xcode project**
   ```bash
   # Install pods first
   cd ios
   pod install
   cd ..

   # Open Xcode
   open ios/BorumithraMobile.xcworkspace

   # In Xcode:
   # - Drag GoogleService-Info.plist into the project
   # - Make sure "Copy items if needed" is checked
   # - Add to BorumithraMobile target
   ```

### Step 4: Configure Permissions

#### Android Permissions

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <application ...>
        <!-- Add Google Maps API Key -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
        
        <!-- Existing code -->
    </application>
</manifest>
```

#### iOS Permissions

Edit `ios/BorumithraMobile/Info.plist`:

```xml
<dict>
    <!-- Existing keys -->
    
    <!-- Camera Permission -->
    <key>NSCameraUsageDescription</key>
    <string>We need camera access to capture motor photos</string>
    
    <!-- Photo Library Permission -->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>We need access to your photo library</string>
    
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>We need access to save motor photos</string>
    
    <!-- Location Permission -->
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>We need your location for motor registration</string>
    
    <key>NSLocationAlwaysUsageDescription</key>
    <string>We need your location for motor registration</string>
</dict>
```

### Step 5: Install iOS Pods (Mac only)

```bash
cd ios
pod install
cd ..
```

**Expected Output**: "Pod installation complete! There are X dependencies..."

### Step 6: Run the Application

#### Option A: Run Android

```bash
# Start Metro bundler (in first terminal)
npm start

# In a second terminal, run Android
npm run android

# Or combine both:
npm start & npm run android
```

**Requirements:**
- Android emulator running OR
- Android device connected via USB with USB debugging enabled

#### Option B: Run iOS (Mac only)

```bash
# Start Metro bundler (in first terminal)
npm start

# In a second terminal, run iOS
npm run ios

# Or combine both:
npm start & npm run ios
```

**Requirements:**
- Xcode installed
- iOS simulator available

## Troubleshooting

### Issue 1: Dependency Errors

**Error**: `ERESOLVE unable to resolve dependency tree`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue 2: Gradle Build Fails

**Error**: `JAVA_HOME is not set`

**Solution**:
```bash
# Find Java installation
which java
/usr/libexec/java_home -V

# Set JAVA_HOME (add to ~/.bashrc or ~/.zshrc)
export JAVA_HOME=$(/usr/libexec/java_home)
export PATH=$JAVA_HOME/bin:$PATH

# Or on Linux
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

**Error**: `Task ':react-native-reanimated:assertMinimalReactNativeVersionTask' failed`

**Solution**: Already fixed in package.json (reanimated downgraded to 3.3.0)

**Error**: Gradle build fails

**Solution**:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
npm run android
```

### Issue 3: Metro Bundler Issues

**Error**: Metro bundler crashes or shows errors

**Solution**:
```bash
# Clear Metro cache
npm start -- --reset-cache

# Or
npx react-native start --reset-cache
```

### Issue 4: iOS Pod Install Fails

**Error**: Pod dependencies fail

**Solution**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

### Issue 5: Firebase Not Working

**Error**: Firebase crashes or doesn't initialize

**Solutions**:
1. Verify `google-services.json` is in `android/app/`
2. Verify `GoogleService-Info.plist` is in Xcode project
3. Check Firebase config in `.env` file
4. Rebuild the app:
   ```bash
   # Android
   cd android && ./gradlew clean && cd ..
   npm run android
   
   # iOS
   cd ios && rm -rf build && cd ..
   npm run ios
   ```

### Issue 6: Maps Not Showing

**Error**: Maps show blank or crash

**Solution**:
1. Add Google Maps API key to AndroidManifest.xml
2. Enable Maps SDK for Android in Google Cloud Console
3. Enable Maps SDK for iOS in Google Cloud Console

### Issue 7: Build Succeeds But App Crashes

**Common causes**:
1. Missing Firebase config files
2. Incorrect package names
3. Missing permissions

**Solution**:
```bash
# Check logs
npx react-native log-android  # For Android
npx react-native log-ios       # For iOS

# Check if package name matches
grep "applicationId" android/app/build.gradle
# Should show: applicationId "com.borumithramobile"

# Check Firebase package name matches
cat android/app/google-services.json | grep package_name
# Should show: "package_name": "com.borumithramobile"
```

## Verification Checklist

Before running the app, verify:

- [ ] Node.js v18+ installed
- [ ] npm v9+ installed
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] `.env` file created and configured
- [ ] `google-services.json` in `android/app/`
- [ ] `GoogleService-Info.plist` in Xcode project (iOS only)
- [ ] Permissions configured in AndroidManifest.xml
- [ ] Permissions configured in Info.plist (iOS only)
- [ ] Android emulator running OR device connected
- [ ] iOS simulator available (Mac only)

## Development Workflow

### Daily Development

```bash
# Start Metro bundler
npm start

# In another terminal, run app
npm run android  # or npm run ios

# App will reload automatically on code changes
```

### Making Changes

1. Edit files in `src/` directory
2. Save changes
3. Metro will automatically reload (Fast Refresh)
4. If changes don't reflect, press `r` in Metro terminal to reload

### Building for Production

#### Android APK

```bash
cd android
./gradlew assembleRelease
# APK will be in: android/app/build/outputs/apk/release/app-release.apk
```

#### Android AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease
# AAB will be in: android/app/build/outputs/bundle/release/app-release.aab
```

#### iOS (Mac only)

1. Open `ios/BorumithraMobile.xcworkspace` in Xcode
2. Select "Any iOS Device" or your device
3. Product → Archive
4. Follow Xcode instructions to upload to App Store Connect

## Success Indicators

When everything is set up correctly:

1. **Metro bundler starts** and shows:
   ```
   ████████████████████████████████████
   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
   Welcome to Metro!
   ```

2. **App builds successfully** and launches on device/emulator

3. **Login screen appears** with Borumithra Mobile branding

4. **No red error screens** in the app

5. **Console shows** "Running application"

## Quick Start Summary

```bash
# One-time setup
npm install --legacy-peer-deps
cp .env.example .env
# Add Firebase config files
# Configure permissions

# iOS only
cd ios && pod install && cd ..

# Run the app
npm start &
npm run android  # or npm run ios
```

## Getting Help

If you encounter issues not covered here:

1. **Check documentation**
   - DEPENDENCY_FIX.md - Dependency issues
   - NATIVE_FOLDERS_ADDED.md - Native folder setup
   - START_HERE.md - Quick start

2. **Check logs**
   ```bash
   npx react-native log-android  # Android logs
   npx react-native log-ios       # iOS logs
   ```

3. **Run diagnostics**
   ```bash
   npx react-native doctor
   ```

4. **Common resources**
   - [React Native Docs](https://reactnative.dev/)
   - [React Native Firebase](https://rnfirebase.io/)
   - [React Navigation](https://reactnavigation.org/)

---

**Last Updated**: January 3, 2025
**React Native Version**: 0.73.2
**Status**: Production Ready ✅
