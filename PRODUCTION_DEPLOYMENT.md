# Production Deployment Guide - SPA Routing Fix

## Overview
This guide ensures that the Single Page Application (SPA) routing works correctly in production on Vercel.

## The Problem Explained

### Why Pages Were Breaking on Reload

**Root Cause**: **Server-Side vs Client-Side Routing Mismatch**

1. **Client-Side Routing (React Router)**
   - Works when navigating within the app
   - Uses JavaScript to change the URL without server requests
   - Example: Clicking a link to `/questionnaire` works fine

2. **Server-Side Routing (Browser Reload)**
   - When user reloads page, browser makes direct HTTP request to server
   - Server looks for physical files matching the URL
   - Example: Reloading `/questionnaire` → Server looks for `questionnaire.html` (doesn't exist)

3. **The Mismatch**
   ```
   User reloads /questionnaire
   ↓
   Browser requests: GET https://yourapp.vercel.app/questionnaire
   ↓
   Vercel server looks for: /questionnaire file
   ↓
   File doesn't exist → 404 Error → Page breaks
   ```

## Solution Implementation

### 1. Vercel Configuration (`vercel.json`)

```json
{
  "rewrites": [
    {
      "source": "/api/uat/:path*",
      "destination": "https://uat-platform.bankkaro.com/:path*"
    },
    {
      "source": "/api/external/:path*", 
      "destination": "https://bk-api.bankkaro.com/:path*"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

**What this does:**
- `/((?!api/).*)` - Matches all routes EXCEPT those starting with `/api/`
- `destination: "/index.html"` - Serves the main React app for all non-API routes
- This tells Vercel: "For any route that's not an API call, serve the React app"

### 2. Development vs Production

| Environment | Configuration | How it works |
|-------------|---------------|--------------|
| **Development** | `vite.config.ts` with `historyApiFallback: true` | Vite dev server handles SPA routing |
| **Production** | `vercel.json` with rewrite rules | Vercel server handles SPA routing |

## Testing Production Deployment

### Pre-Deployment Checklist
- [ ] `vercel.json` is in the root directory
- [ ] `public/_redirects` exists for Netlify fallback
- [ ] All form inputs have `name` attributes
- [ ] Enter key functionality is implemented

### Post-Deployment Testing
1. **Direct URL Access**
   ```
   https://yourapp.vercel.app/questionnaire
   https://yourapp.vercel.app/loan-offers
   https://yourapp.vercel.app/any-route
   ```
   All should load the React app correctly.

2. **Page Reload Test**
   - Navigate to any route
   - Press F5 or Ctrl+R to reload
   - Page should load correctly without breaking

3. **Browser Navigation Test**
   - Use browser back/forward buttons
   - Should work correctly

4. **Bookmark Test**
   - Bookmark any route
   - Access bookmark directly
   - Should work correctly

## Troubleshooting

### If Pages Still Break on Reload

1. **Check Vercel Deployment Logs**
   ```bash
   vercel logs
   ```

2. **Verify Configuration**
   - Ensure `vercel.json` is in root directory
   - Check that rewrite rules are correct

3. **Clear Vercel Cache**
   ```bash
   vercel --prod
   ```

4. **Alternative Configuration**
   If the regex pattern doesn't work, try this simpler version:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

### Common Issues

1. **API Routes Breaking**
   - Ensure API routes are excluded from the catch-all rule
   - Use `/((?!api/).*)` pattern

2. **Static Assets Not Loading**
   - Static assets (CSS, JS, images) should still work
   - They're served from the `public` directory

3. **Build Issues**
   - Ensure `npm run build` completes successfully
   - Check for TypeScript errors

## Alternative Deployment Platforms

### Netlify
- Uses `public/_redirects` file
- Configuration: `/* /index.html 200`

### GitHub Pages
- Requires `basename` in React Router
- Use `HashRouter` instead of `BrowserRouter`

### AWS S3 + CloudFront
- Configure CloudFront to serve `index.html` for 404s
- Set up error pages in S3

## Performance Considerations

### Caching Strategy
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### Bundle Optimization
- Ensure code splitting is implemented
- Use lazy loading for routes
- Optimize bundle size

## Security Considerations

1. **API Route Protection**
   - Ensure API routes are properly secured
   - Use authentication where needed

2. **CORS Configuration**
   - Configure CORS headers for API routes
   - Restrict origins in production

## Monitoring

### Vercel Analytics
- Monitor 404 errors
- Track page load performance
- Check for routing issues

### Error Tracking
- Implement error boundary in React
- Log client-side errors
- Monitor server-side errors

## Conclusion

The SPA routing fix ensures that:
- ✅ All routes work on page reload
- ✅ Direct URL access works
- ✅ Browser navigation works
- ✅ Bookmarks work
- ✅ API routes remain functional

This configuration is production-ready and handles the server-side routing issue that was causing page breaks on reload. 