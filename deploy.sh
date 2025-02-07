#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Add all changes to git
echo "Adding changes to git..."
git add .

# Get current timestamp
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

# Commit changes
echo "Committing changes..."
git commit -m "Auto-deploy: $timestamp"

# Push to main branch
echo "Pushing to main branch..."
git push origin main

# Create a temporary directory for deployment
echo "Preparing deployment..."
rm -rf temp-deploy
mkdir temp-deploy
cp -r dist/* temp-deploy/

# Switch to gh-pages branch
echo "Switching to gh-pages branch..."
git checkout gh-pages || git checkout -b gh-pages

# Clean the working directory
rm -rf assets index.html

# Copy the new build
cp -r temp-deploy/* .
rm -rf temp-deploy

# Add and commit changes
git add .
git commit -m "Deploy: $timestamp"

# Push to gh-pages
echo "Pushing to gh-pages..."
git push origin gh-pages --force

# Switch back to main branch
git checkout main

echo "Deployment complete! Your changes will be live in a few minutes at: https://nitturkaryash.github.io/chic-salon-ecosystem-main/"
echo "If you see a white screen, please wait a few minutes and hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)" 