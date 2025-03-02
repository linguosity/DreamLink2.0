#!/bin/bash
# Exit immediately if a command fails
set -e

echo "====== VERCEL BUILD STARTING ======"
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

# Install main dependencies
echo "====== INSTALLING DEPENDENCIES ======"
npm install --no-fund --no-audit --loglevel verbose

# Install specific packages that might be missing in Vercel
echo "====== INSTALLING SPECIFIC PACKAGES ======"
npm install --save framer-motion@12.4.7 zod@3.24.2 @radix-ui/react-toast @radix-ui/react-alert-dialog @radix-ui/react-tooltip @radix-ui/react-tabs

# Install shadcn-ui CLI
echo "====== INSTALLING SHADCN CLI ======"
npm install shadcn-ui@latest --save-dev

# Create components/ui directory if it doesn't exist
echo "====== CREATING UI COMPONENTS DIRECTORY ======"
mkdir -p components/ui

# Copy existing UI components if they don't exist in Vercel
echo "====== CHECKING FOR EXISTING UI COMPONENTS ======"
if [ ! -f "components/ui/skeleton.tsx" ]; then
  echo "Creating skeleton component fallback..."
  cat > components/ui/skeleton.tsx << 'EOF'
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
EOF
fi

# Log environment and build info
echo "====== ENVIRONMENT INFO ======"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Directory structure in components/ui:"
ls -la components/ui/

# Try running a simpler build command
echo "====== STARTING NEXT.JS BUILD ======"
NODE_OPTIONS="--max-old-space-size=4096" npx next build

echo "====== BUILD PROCESS COMPLETED ======"