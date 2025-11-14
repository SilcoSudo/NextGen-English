# Google OAuth Configuration - Fix Authorization Error

## Problem
Getting "Error 401: Invalid_client - no registered origin" when clicking "Sign in with Google"

## Solution

### Step 1: Access Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Select your project: **NextGen English**
3. Navigate to: **APIs & Services** → **Credentials**

### Step 2: Edit OAuth 2.0 Client
1. Find your Web Application OAuth 2.0 Client ID
2. Click on it to edit

### Step 3: Add Authorized Redirect URIs
Under "Authorized redirect URIs", add these URLs:

```
https://api.nextgenenglish.id.vn/api/auth/google/callback
http://localhost:5000/api/auth/google/callback
http://localhost:3000/auth-success
https://nextgenenglish.id.vn/auth-success
```

### Step 4: Add Authorized JavaScript Origins
Under "Authorized JavaScript origins", add these domains:

```
https://nextgenenglish.id.vn
https://api.nextgenenglish.id.vn
http://localhost:3000
http://localhost:5000
```

### Step 5: Save
Click "Save" button at bottom

### Step 6: Test
- Refresh the website
- Try clicking "Sign in with Google" again
- You should now see Google's login page instead of the authorization error

## Verification Checklist
- [ ] Redirect URIs added to Google Console
- [ ] JavaScript origins added to Google Console
- [ ] Changes saved in Google Console
- [ ] Website refreshed in browser
- [ ] Tested Google login button

## Current Configuration
**Google Client ID:** 1049204415742-guuceu5m3fu44qi67472u4g0r7utvnef.apps.googleusercontent.com
**Callback URL:** https://api.nextgenenglish.id.vn/api/auth/google/callback
**Frontend Domain:** https://nextgenenglish.id.vn
**API Domain:** https://api.nextgenenglish.id.vn

## Still Not Working?
1. Try incognito/private browsing (bypass browser cache)
2. Check browser console for errors (Press F12)
3. Verify the Google Client ID matches between:
   - Google Cloud Console
   - backend/.env (GOOGLE_CLIENT_ID)
   - frontend/.env.production (REACT_APP_GOOGLE_CLIENT_ID)
