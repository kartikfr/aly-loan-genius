# Environment Configuration

This project now uses environment variables for configuration instead of hardcoded values in the Vite config.

## Environment Files

### `.env.development`
Used for development environment with UAT APIs.

### `.env.production` 
Used for production environment with live APIs.

### `.env.local`
Local overrides (gitignored) for personal development settings.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_HOST` | Server host | `::` (development) / `0.0.0.0` (production) |
| `VITE_PORT` | Server port | `8080` (development) / `3000` (production) |
| `VITE_UAT_API_URL` | UAT API base URL | `https://uat-platform.bankkaro.com` |
| `VITE_EXTERNAL_API_URL` | External API base URL | `https://bk-api.bankkaro.com` |
| `VITE_PARTNER_API_KEY` | Partner API key | `test` |
| `VITE_LEAD_TYPE` | Lead type for API calls | `PL` |

## Usage

### Development
```bash
npm run dev
```
Uses `.env.development` configuration with Vite proxy.

### Production (Vercel)
```bash
npm run build
```
Uses `.env.production` configuration with Vercel rewrites.

### Local Override
Create `.env.local` to override any settings for your local development.

## Vite Config Changes

The `vite.config.ts` now reads environment variables and only uses proxy in development:

```typescript
server: {
  host: env.VITE_HOST || "::",
  port: parseInt(env.VITE_PORT || "8080"),
  // Only use proxy in development mode
  ...(mode === 'development' && {
    proxy: {
      '/api/uat': {
        target: env.VITE_UAT_API_URL || 'https://uat-platform.bankkaro.com',
        // ...
      }
    }
  })
}
```

## Vercel Production Configuration

For production deployment on Vercel, the `vercel.json` file handles API proxying:

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
    }
  ]
}
```

## API Service Changes

The `src/lib/api.ts` now uses environment variables:

```typescript
const PARTNER_API_KEY = import.meta.env.VITE_PARTNER_API_KEY || 'test';
const LEAD_TYPE = import.meta.env.VITE_LEAD_TYPE || 'PL';
```

## Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy - Vercel will use `vercel.json` for API proxying

### Environment Variables in Vercel
Set these in your Vercel project settings:
- `VITE_PARTNER_API_KEY`
- `VITE_LEAD_TYPE`
- `VITE_UAT_API_URL`
- `VITE_EXTERNAL_API_URL` 