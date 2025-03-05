#!/bin/bash
set -e

# ANSI color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Dreamlink Vercel Deployment Script ===${NC}"
echo -e "${YELLOW}This script will deploy your app to Vercel and push Supabase changes${NC}"

# 1. Push Supabase Changes
echo -e "\n${GREEN}Step 1: Pushing Supabase changes...${NC}"
supabase link --project-ref qnfhruhghbckqpqxitwu
supabase db push

# 2. Deploy to Vercel
echo -e "\n${GREEN}Step 2: Deploying to Vercel...${NC}"
echo -e "${YELLOW}Note: Make sure you've logged into Vercel CLI with 'vercel login'${NC}"

# Create vercel.json if needed
if [ ! -f "vercel.json" ]; then
  cat > vercel.json << EOF
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install"
}
EOF
  echo "Created vercel.json configuration file"
fi

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"

# Link the project if not already linked
if [ ! -d ".vercel" ]; then
  echo "Linking project to Vercel..."
  vercel link --yes
fi

# Deploy with production flag
vercel --prod --yes

echo -e "\n${GREEN}Deployment Complete!${NC}"
echo -e "${YELLOW}Important: Make sure your environment variables are set in the Vercel dashboard:${NC}"
echo "- NEXT_PUBLIC_SUPABASE_URL"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "- SUPABASE_SERVICE_ROLE_KEY"
echo "- SUPABASE_JWT_SECRET"
echo "- OPENAI_API_KEY"