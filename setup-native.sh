#!/bin/bash

# Borumithra Mobile - Native Setup Script
# This script initializes Android and iOS folders for React Native

set -e

echo "================================================"
echo "Borumithra Mobile - Native Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 18 or higher from https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check if we're in the project directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${GREEN}✓ package.json found${NC}"

# Backup current source code
echo ""
echo "Step 1: Backing up source code..."
BACKUP_DIR="../borumithra-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Copy important files
cp -r src "$BACKUP_DIR/" 2>/dev/null || true
cp App.tsx "$BACKUP_DIR/" 2>/dev/null || true
cp package.json "$BACKUP_DIR/"
cp tsconfig.json "$BACKUP_DIR/" 2>/dev/null || true
cp babel.config.js "$BACKUP_DIR/" 2>/dev/null || true
cp metro.config.js "$BACKUP_DIR/" 2>/dev/null || true
cp index.js "$BACKUP_DIR/" 2>/dev/null || true
cp *.md "$BACKUP_DIR/" 2>/dev/null || true
cp .env.example "$BACKUP_DIR/" 2>/dev/null || true

echo -e "${GREEN}✓ Backup created at: $BACKUP_DIR${NC}"

# Ask user for setup method
echo ""
echo "Choose setup method:"
echo "1) Fresh React Native initialization (Recommended)"
echo "2) Keep current structure and add templates manually"
echo ""
read -p "Enter choice (1 or 2): " SETUP_METHOD

if [ "$SETUP_METHOD" = "1" ]; then
    echo ""
    echo "Step 2: Initializing React Native project..."
    echo -e "${YELLOW}This will create android/ and ios/ folders${NC}"
    
    # Create a temporary directory
    TEMP_PROJECT="BorumithraMobile_temp"
    
    # Initialize React Native project in temp directory
    npx react-native init "$TEMP_PROJECT" --version 0.73.2 --skip-install
    
    if [ -d "$TEMP_PROJECT" ]; then
        # Copy native folders to current directory
        echo "Copying native folders..."
        cp -r "$TEMP_PROJECT/android" ./
        cp -r "$TEMP_PROJECT/ios" ./
        
        # Update iOS project name in Podfile
        if [ -f "ios/Podfile" ]; then
            sed -i.bak "s/$TEMP_PROJECT/BorumithraMobile/g" ios/Podfile
            rm -f ios/Podfile.bak
        fi
        
        # Clean up temp project
        rm -rf "$TEMP_PROJECT"
        
        echo -e "${GREEN}✓ Native folders created${NC}"
    else
        echo -e "${RED}Error: Failed to create React Native project${NC}"
        exit 1
    fi
    
elif [ "$SETUP_METHOD" = "2" ]; then
    echo ""
    echo -e "${YELLOW}Manual setup selected${NC}"
    echo "You'll need to:"
    echo "1. Download React Native template from GitHub"
    echo "2. Copy android/ and ios/ folders manually"
    echo "3. Configure native modules"
    echo ""
    echo "See NATIVE_SETUP.md for detailed instructions"
    exit 0
else
    echo -e "${RED}Invalid choice${NC}"
    exit 1
fi

# Install dependencies
echo ""
echo "Step 3: Installing dependencies..."
npm install

echo -e "${GREEN}✓ Dependencies installed${NC}"

# iOS specific setup (if on Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo ""
    echo "Step 4: Installing iOS dependencies..."
    cd ios
    
    # Check if CocoaPods is installed
    if ! command -v pod &> /dev/null; then
        echo -e "${YELLOW}CocoaPods not found. Installing...${NC}"
        sudo gem install cocoapods
    fi
    
    pod install
    cd ..
    echo -e "${GREEN}✓ iOS dependencies installed${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠ Skipping iOS setup (not on macOS)${NC}"
fi

# Create necessary configuration files
echo ""
echo "Step 5: Setting up configuration..."

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please update .env with your Firebase and Razorpay credentials${NC}"
fi

# Update Android package name
echo ""
echo "Updating Android package name..."
PACKAGE_NAME="com.borumithramobile"

# Update gradle files
if [ -f "android/app/build.gradle" ]; then
    sed -i.bak "s/applicationId \".*\"/applicationId \"$PACKAGE_NAME\"/" android/app/build.gradle
    rm -f android/app/build.gradle.bak
fi

# Update AndroidManifest.xml
if [ -f "android/app/src/main/AndroidManifest.xml" ]; then
    sed -i.bak "s/package=\".*\"/package=\"$PACKAGE_NAME\"/" android/app/src/main/AndroidManifest.xml
    rm -f android/app/src/main/AndroidManifest.xml.bak
fi

echo -e "${GREEN}✓ Configuration updated${NC}"

# Create Firebase placeholder files
echo ""
echo "Creating Firebase configuration placeholders..."

cat > android/app/google-services.json.template << 'EOF'
{
  "project_info": {
    "project_number": "YOUR_PROJECT_NUMBER",
    "project_id": "YOUR_PROJECT_ID",
    "storage_bucket": "YOUR_PROJECT_ID.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "YOUR_APP_ID",
        "android_client_info": {
          "package_name": "com.borumithramobile"
        }
      }
    }
  ]
}
EOF

cat > ios/GoogleService-Info.plist.template << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CLIENT_ID</key>
    <string>YOUR_CLIENT_ID</string>
    <key>REVERSED_CLIENT_ID</key>
    <string>YOUR_REVERSED_CLIENT_ID</string>
    <key>API_KEY</key>
    <string>YOUR_API_KEY</string>
    <key>GCM_SENDER_ID</key>
    <string>YOUR_SENDER_ID</string>
    <key>PLIST_VERSION</key>
    <string>1</string>
    <key>BUNDLE_ID</key>
    <string>org.reactjs.native.example.BorumithraMobile</string>
    <key>PROJECT_ID</key>
    <string>YOUR_PROJECT_ID</string>
</dict>
</plist>
EOF

echo -e "${GREEN}✓ Firebase templates created${NC}"

# Final instructions
echo ""
echo "================================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure Firebase:"
echo "   - Download google-services.json from Firebase Console"
echo "   - Place it in: android/app/google-services.json"
echo "   - Download GoogleService-Info.plist"
echo "   - Place it in: ios/GoogleService-Info.plist"
echo ""
echo "2. Update .env file with your credentials"
echo ""
echo "3. Run the app:"
echo "   - Android: npm run android"
echo "   - iOS: npm run ios (Mac only)"
echo ""
echo "4. If you encounter issues:"
echo "   - Run: npx react-native doctor"
echo "   - Check NATIVE_SETUP.md for troubleshooting"
echo ""
echo -e "${YELLOW}Backup location: $BACKUP_DIR${NC}"
echo ""
