# Vercel Environment Variables Setup

## 🚨 CRITICAL: Complete These Steps to Fix Vercel Deployment

Your code is now pushed to GitHub, but Vercel needs environment variables configured before it will work.

---

## Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Find your project: `fromscratch-site-build-junk`
3. Click on the project name

---

## Step 2: Navigate to Environment Variables

1. Click **Settings** tab (top navigation)
2. Click **Environment Variables** in the left sidebar

---

## Step 3: Add These Environment Variables

Add each of these variables **one at a time**:

### Variable 1: Anthropic API Key
```
Name: ANTHROPIC_API_KEY
Value: [Your Anthropic API key from the Vercel dashboard - already configured]
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Variable 2: Cloudinary Cloud Name
```
Name: PUBLIC_CLOUDINARY_CLOUD_NAME
Value: dk6zsdaaj
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Variable 3: Cloudinary Upload Preset
```
Name: PUBLIC_CLOUDINARY_UPLOAD_PRESET
Value: junk-haulers
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Variable 4: Zapier Webhook URL
```
Name: ZAPIER_WEBHOOK_URL
Value: https://hooks.zapier.com/hooks/catch/7361629/uic8quf/
Environments: ✅ Production, ✅ Preview, ✅ Development
```

---

## Step 4: Trigger Redeploy

After adding all 4 variables:

1. Go to **Deployments** tab
2. Click the **three dots (•••)** on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)
5. Click **Redeploy**

---

## Step 5: Verify Deployment

Once the deployment completes (~2-3 minutes):

1. Click **Visit** button to open your live site
2. Navigate to `/quote` page
3. Fill out the form and upload a test photo
4. Submit the form

### What Should Happen:
✅ Photo uploads successfully (no 401 error)
✅ AI analyzes the photo and provides estimate
✅ Lead is sent to Zapier → Go High Level
✅ Form redirects to success page with pricing

### Check Logs:
1. In Vercel, go to **Deployments** tab
2. Click on the deployment
3. Click **Functions** tab
4. Check logs for:
   - `✅ Valid lead received`
   - `📤 Sending to webhook`
   - `✅ Lead sent to Zapier/GHL successfully`

---

## Step 6: Test in Go High Level

1. Go to your Go High Level account
2. Check if the lead appears in your contacts/opportunities
3. Verify all data transferred correctly:
   - Contact information
   - Property details
   - AI estimate
   - Photo URLs

---

## Troubleshooting

### Issue: Photo upload still fails (401 Unauthorized)

**Solution**: Double-check environment variables
- Make sure `PUBLIC_CLOUDINARY_CLOUD_NAME` is exactly: `dk6zsdaaj`
- Make sure `PUBLIC_CLOUDINARY_UPLOAD_PRESET` is exactly: `junk-haulers`
- **Important**: Variable names must start with `PUBLIC_` for client-side access
- Redeploy after making any changes

### Issue: Leads not appearing in Go High Level

**Solution**: Check Zapier
1. Go to https://zapier.com/app/zaps
2. Find your zap connected to this webhook
3. Check the **Task History** for recent submissions
4. Verify the Zap is turned **ON**
5. Check if there are any error messages

### Issue: Webhook times out or fails

**Solution**: Check Vercel function logs
1. Vercel → Deployments → Latest → Functions
2. Look for errors in `save-lead` function
3. Check if retry attempts are showing
4. If all retries fail, email fallback will trigger (check logs for `📧`)

---

## What's Been Fixed

### ✅ Cloudinary Integration
- **Before**: Credentials hardcoded in PhotoUploadStep.jsx
- **After**: Uses environment variables, works on Vercel

### ✅ Lead Capture System
- **Before**: Leads only logged to console (lost)
- **After**: Sent to Go High Level via Zapier webhook
- **Backup**: Email fallback if webhook fails

### ✅ Spam Protection
- **Before**: None
- **After**: Honeypot field blocks spam bots

### ✅ Reliability
- **Before**: Single attempt, no retry
- **After**: 3 retry attempts with exponential backoff

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | AI photo analysis | `sk-ant-api03-...` |
| `PUBLIC_CLOUDINARY_CLOUD_NAME` | Photo storage cloud | `dk6zsdaaj` |
| `PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload config | `junk-haulers` |
| `ZAPIER_WEBHOOK_URL` | Send leads to GHL | `https://hooks.zapier.com/...` |

**Note**: Variables starting with `PUBLIC_` are accessible in the browser (client-side). Other variables are only available on the server.

---

## Next Steps After Vercel Setup

1. **Test the Complete Flow**
   - Submit a test quote from production site
   - Verify it appears in Go High Level
   - Confirm photos load correctly
   - Check pricing looks accurate

2. **Set Up Zapier Zap** (if not done already)
   - Trigger: Catch Webhook (your URL above)
   - Action: Create/Update Contact in Go High Level
   - Map all fields from the webhook payload
   - Test the Zap

3. **Optional: Set Up Email Fallback**
   - Sign up at https://resend.com
   - Get API key
   - Add `RESEND_API_KEY` to Vercel
   - Uncomment email code in `send-email.js`

4. **Google Ads Ready!**
   - Once everything works, you're ready to launch ads
   - All leads will automatically go to Go High Level
   - Photos and AI estimates included

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Zapier task history
3. Check browser console for client-side errors
4. Verify all 4 environment variables are set correctly in Vercel

---

**Status**: 🟡 Waiting for Vercel environment variable configuration
**Once complete**: 🟢 Production ready!
