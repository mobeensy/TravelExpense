#!/bin/bash

echo "🚀 Running project setup..."

# Install npm dependencies
echo "📦 Installing npm packages..."
npm install

# Install CocoaPods for iOS
echo "🍎 Installing CocoaPods..."
cd ios && pod install && cd ..

echo "✅ Setup complete! You can now run the app."

# Optional: Run Metro bundler after setup
echo "🔄 Starting Metro bundler..."
npx react-native start
