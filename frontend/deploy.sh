#!/bin/bash

echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building the project..."
npm run build

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment completed!"
echo "🌍 Your app should be available at: https://silcosudo.github.io/NextGen-English/"
echo ""
echo "📝 Note: It may take a few minutes for changes to appear on GitHub Pages." 