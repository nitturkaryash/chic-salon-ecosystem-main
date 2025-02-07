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

# Push to gh-pages
echo "Deploying to gh-pages..."
git subtree push --prefix dist origin gh-pages

echo "Deployment complete! Your changes are live at: https://nitturkaryash.github.io/chic-salon-ecosystem-main/" 