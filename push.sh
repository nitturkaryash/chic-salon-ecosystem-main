#!/bin/bash

# Add all changes
git add .

# Get the commit message from the user
echo "Enter your commit message:"
read commit_message

# Commit with the provided message
git commit -m "$commit_message"

# Push to GitHub
git push origin main

echo "Changes pushed successfully!" 