#!/bin/bash

# Install main dependencies
npm install

# Install specific packages that may be missing
npm install framer-motion@12.4.7 zod@3.24.2

# Install shadcn components
if [ ! -d "components/ui/skeleton" ]; then
  npx shadcn-ui@latest add skeleton --yes
fi

if [ ! -d "components/ui/alert-dialog" ]; then
  npx shadcn-ui@latest add alert-dialog --yes
fi

# Run the build
npm run build