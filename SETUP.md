# Multi-Step Lead Form Setup Guide

This guide will help you set up the AI-powered multi-step lead form for Junk Hauler Boise.

## Features

- 6-step form with progress indicator
- AI-powered volume estimation from photos using Claude 3.5 Sonnet
- Automatic pricing calculation with ±20% range
- Photo upload via Cloudinary
- Lead storage in Supabase (optional)
- Email notifications via Resend (optional)
- Form state persistence in localStorage

## Required Setup

### 1. Anthropic Claude API (REQUIRED)

The form uses Claude 3.5 Sonnet to analyze junk photos and estimate cubic yards.

1. Go to https://console.anthropic.com/
2. Create an account or sign in
3. Go to API Keys and create a new key
4. Copy the key (starts with `sk-ant-`)
5. Add to your `.env` file:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

**Cost:** ~$0.01 per image analysis (very affordable)

### 2. Cloudinary (REQUIRED)

Cloudinary handles photo uploads with a beautiful widget.

1. Go to https://cloudinary.com and create a free account
2. From your dashboard, note your **Cloud Name**
3. Go to Settings → Upload → Upload presets
4. Create a new unsigned upload preset:
   - Name it something like `junk-removal-leads`
   - Signing mode: **Unsigned**
   - Folder: `junk-removal-leads`
5. Add to your `.env` file:
   ```
   PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   PUBLIC_CLOUDINARY_UPLOAD_PRESET=junk-removal-leads
   ```

**Free tier:** 25GB storage, 25GB bandwidth/month (plenty for most use cases)

## Optional Setup

### 3. Supabase (Optional - for storing leads)

Supabase provides a PostgreSQL database to store all your leads.

1. Go to https://supabase.com and create a project
2. Go to Table Editor and create a new table called `leads`
3. Add these columns:
   - `id` (uuid, primary key, default: `gen_random_uuid()`)
   - `created_at` (timestamptz, default: `now()`)
   - `property_type` (text)
   - `junk_types` (jsonb)
   - `city` (text)
   - `address` (text, nullable)
   - `date_needed` (text)
   - `access_difficult` (boolean, default: false)
   - `photos` (jsonb)
   - `cubic_yards_min` (numeric)
   - `cubic_yards_max` (numeric)
   - `price_min` (numeric)
   - `price_max` (numeric)
   - `confidence` (text)
   - `contact_name` (text)
   - `contact_phone` (text)
   - `contact_email` (text)
   - `notes` (text, nullable)
   - `status` (text, default: `'new'`)
4. Go to Settings → API to get your project URL and anon key
5. Install Supabase: `npm install @supabase/supabase-js`
6. Uncomment the Supabase code in `src/pages/api/save-lead.js`
7. Add to your `.env` file:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   ```

**Free tier:** 500MB database, 2GB file storage, 5GB bandwidth/month

### 4. Resend (Optional - for email notifications)

Resend sends beautiful email notifications when new leads come in.

1. Go to https://resend.com and create an account
2. Verify your domain (or use `onboarding@resend.dev` for testing)
3. Create an API key
4. Install Resend: `npm install resend`
5. Uncomment the Resend code in `src/pages/api/send-email.js`
6. Add to your `.env` file:
   ```
   RESEND_API_KEY=re_your_key_here
   ```

**Free tier:** 100 emails/day, 3,000 emails/month

## Testing the Form

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:4321/quote

3. Fill out the form:
   - Select a property type
   - Choose junk types
   - Select your city
   - Pick a date
   - Upload photos (use real junk photos for best AI results)
   - Enter contact info

4. Check your console logs to see:
   - AI estimation results
   - Pricing calculations
   - Lead data (if Supabase is configured)
   - Email notification sent (if Resend is configured)

## How It Works

### Form Flow

1. **Step 1-4:** User answers questions about property, junk, location, and date
2. **Step 5:** User uploads photos
   - Photos are sent to Cloudinary
   - When user clicks "Next", photos are sent to Claude API
   - Claude analyzes images and estimates cubic yards
   - Pricing is calculated based on estimate
3. **Step 6:** User sees AI estimate and enters contact info
   - User reviews estimate
   - Enters name, phone, email
   - Submits form
   - Lead is saved to Supabase (if configured)
   - Email notification is sent (if configured)
   - User is redirected to success page

### AI Estimation

The AI estimation uses Claude 3.5 Sonnet with a carefully crafted prompt that:
- Provides reference examples (e.g., "a sofa = 10-15 cubic yards")
- Asks Claude to identify individual items
- Requests conservative estimates
- Returns structured JSON with min/max ranges

### Pricing Calculation

The pricing system in `src/lib/pricing.js`:
- Base rate: $25/cubic yard
- Disposal fee: $8/cubic yard
- Minimum charge: $150
- Volume discounts: 10% off 50+ yards, 15% off 100+ yards, 20% off 200+ yards
- Labor surcharges: stairs ($50), difficult access ($75), heavy items ($100)
- Final range: ±20% of calculated price

## Customization

### Adjusting Pricing

Edit `src/lib/pricing.js` to change:
- Base rates
- Minimum charges
- Volume discounts
- Labor surcharges

### Modifying Form Steps

Edit components in `src/components/lead-form/`:
- `PropertyTypeStep.jsx` - Add/remove property types
- `JunkTypeStep.jsx` - Add/remove junk categories
- `LocationStep.jsx` - Update cities served
- `DateStep.jsx` - Modify date picker options
- `PhotoUploadStep.jsx` - Change upload settings
- `PriceEstimate.jsx` - Customize estimate display

### Improving AI Accuracy

As you collect real data, you can improve AI accuracy:
1. Keep track of AI estimates vs actual cubic yards
2. Update the reference examples in `src/pages/api/estimate.js`
3. Adjust the prompt to address common estimation errors
4. Add more specific examples for your common junk types

## Troubleshooting

### Form not loading
- Check browser console for errors
- Ensure React integration is working: `npm run dev` should show no errors

### Photos not uploading
- Verify Cloudinary credentials in `.env`
- Check that upload preset is "unsigned"
- Look for errors in browser console

### AI estimation failing
- Verify Anthropic API key is correct
- Check server console for API errors
- Ensure photos are publicly accessible URLs
- Note: Claude has rate limits (check your usage)

### Form submission failing
- Check browser and server consoles
- Verify API routes are accessible
- If using Supabase: check table schema matches
- If using Resend: verify domain and API key

## Cost Estimation

For 100 leads per month:
- Anthropic Claude: ~$10/month (100-200 photos analyzed)
- Cloudinary: Free (within 25GB bandwidth)
- Supabase: Free (within limits)
- Resend: Free (within 100 emails/day)

**Total: ~$10/month** for basic setup

For 500 leads per month:
- Anthropic Claude: ~$50/month
- Cloudinary: Free (still within limits)
- Supabase: Free (might need upgrade at ~1000 leads)
- Resend: $20/month (for higher volume)

**Total: ~$70/month** for higher volume

## Support

For issues or questions:
- Anthropic docs: https://docs.anthropic.com
- Cloudinary docs: https://cloudinary.com/documentation
- Supabase docs: https://supabase.com/docs
- Resend docs: https://resend.com/docs

## Next Steps

1. Set up required API keys (Anthropic + Cloudinary)
2. Test the form with real photos
3. Monitor AI estimation accuracy
4. Set up Supabase for lead storage
5. Configure Resend for email notifications
6. Customize pricing for your market
7. Deploy to production!
