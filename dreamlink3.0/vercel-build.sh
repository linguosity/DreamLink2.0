#!/bin/bash
set -e

echo "Starting build process..."

# Install main dependencies
echo "Installing main dependencies..."
npm install --no-fund --no-audit

# Install specific packages that might be missing in Vercel
echo "Installing specific packages..."
npm install --save framer-motion@12.4.7 zod@3.24.2 @radix-ui/react-toast @radix-ui/react-alert-dialog @radix-ui/react-tooltip @radix-ui/react-tabs

# Install all required shadcn components
echo "Installing shadcn UI components..."
COMPONENTS=(
  "skeleton"
  "alert-dialog"
  "dialog"
  "tooltip"
  "tabs"
  "button"
  "badge"
  "card"
)

for component in "${COMPONENTS[@]}"; do
  echo "Installing $component component..."
  npx shadcn-ui@latest add $component --yes || echo "Warning: Failed to install $component, might already exist"
done

# Create an empty module for any missing components (fallback)
mkdir -p components/ui

# Log environment and build info
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Directory structure in components/ui:"
ls -la components/ui/

# Run the build
echo "Starting Next.js build..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "Build process completed!"