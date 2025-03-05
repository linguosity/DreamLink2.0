# Dreamlink Deployment Guide

This guide will walk you through deploying Dreamlink to Vercel and syncing your Supabase database.

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed and logged in
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed and logged in
- Your Supabase project already created
- Your Vercel account setup and ready for deployment

## Deployment Steps

### 1. Automated Deployment (Recommended)

We've created a deployment script that handles everything for you:

```bash
./deploy-to-vercel.sh
```

This script will:
1. Push your Supabase database changes
2. Deploy your Next.js app to Vercel

### 2. Manual Deployment

If you prefer to deploy manually, follow these steps:

#### 2.1 Push Supabase Changes

```bash
# Link to your Supabase project
supabase link --project-ref qnfhruhghbckqpqxitwu

# Push database changes
supabase db push
```

#### 2.2 Deploy to Vercel

```bash
# Make sure you're logged in
vercel login

# Deploy to production
vercel --prod
```

## Environment Variables

Make sure these environment variables are set in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `SUPABASE_JWT_SECRET` - Your Supabase JWT secret
- `OPENAI_API_KEY` - Your OpenAI API key for dream analysis

## Troubleshooting

### Authentication Issues

If you're having authentication issues:

1. Verify that your Supabase project's site URL is configured correctly
2. Check that all environment variables are set correctly in Vercel
3. Ensure your Supabase auth redirect URLs include your production domain

### Database Connection Issues

If your app can't connect to the database:

1. Check your RLS policies in Supabase
2. Verify your environment variables
3. Check that your IP isn't being blocked by any firewall

## Updating Your Deployment

When you make changes:

1. Push code changes to GitHub
2. If you're using GitHub integration with Vercel, it will deploy automatically
3. If you've made database changes, run `supabase db push` to update

Alternatively, run the deployment script again:

```bash
./deploy-to-vercel.sh
```