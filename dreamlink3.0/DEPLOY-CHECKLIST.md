# Dreamlink Deployment Checklist

Use this checklist before each deployment to ensure everything is properly configured.

## Supabase Configuration

- [ ] Update `site_url` in `supabase/config.toml` to match your production URL
- [ ] Check that all database migrations are ready to be pushed
- [ ] Verify that RLS policies are working as expected
- [ ] Ensure all Supabase functions are correctly set up

## Environment Variables

- [ ] Verify all required environment variables are set:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SUPABASE_JWT_SECRET`
  - [ ] `OPENAI_API_KEY`

## Application Code

- [ ] Run `npm run build` locally to catch any build errors
- [ ] Run `npm run lint` to ensure code quality
- [ ] Verify that authentication flows work correctly in development
- [ ] Test the dream input and analysis features

## Vercel Configuration

- [ ] Verify `vercel.json` is correctly configured
- [ ] Check that the build settings in Vercel dashboard match your needs
- [ ] Ensure domain settings are correctly configured
- [ ] Check that environment variables are set in Vercel dashboard

## After Deployment

- [ ] Test authentication on the production site
- [ ] Verify that the database connection works
- [ ] Test OpenAI integration
- [ ] Check mobile responsiveness
- [ ] Verify that all routes are working correctly

## If Something Goes Wrong

- [ ] Check Vercel deployment logs for errors
- [ ] Verify Supabase database is accessible
- [ ] Check environment variables are correctly set
- [ ] Look for CORS issues in browser console
- [ ] Check for authentication or JWT issues

Use `./deploy-to-vercel.sh` to handle the deployment process automatically.