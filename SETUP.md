# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. First Use

1. You'll see the modern landing page with animations
2. Click "Explore Inventory" or navigate to `/inventory`
3. Add your first inventory item!
4. All data is automatically saved to your browser's localStorage

## Features

- **No Backend Required:** Everything runs in the browser
- **LocalStorage:** Data persists automatically in your browser
- **Modern UI:** Beautiful dark theme with smooth animations
- **Responsive:** Works on desktop, tablet, and mobile

## Data Storage

All inventory data is stored in your browser's localStorage under the key `pizza-pantry-inventory`. This means:

- ✅ Data persists between sessions
- ✅ No server or database needed
- ✅ Fast and instant
- ⚠️ Data is browser-specific (not synced across devices)
- ⚠️ Limited to ~5-10MB storage

## Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Data Not Persisting
- Check browser console for errors
- Ensure localStorage is enabled in your browser
- Try clearing browser cache and reloading

## Production Deployment

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. No environment variables or backend setup needed!

## Export/Import Data (Future Enhancement)

If you need to backup or transfer your data, you can:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Copy the `pizza-pantry-inventory` value
4. Save it as a backup file
