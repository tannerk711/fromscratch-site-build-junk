# Junk Hauler Boise - Website

Modern, AI-powered landing page and quote system for Junk Hauler Boise, a professional junk removal service in the Treasure Valley.

## Quick Start

```bash
cd junk-hauler-site
npm install
npm run dev
```

Visit `http://localhost:4321` to view the site.

## Features

- **Modern Responsive Design** - Built with Astro and Tailwind CSS v4
- **AI-Powered Quote System** - Multi-step lead capture form with Claude AI photo analysis
- **Instant Volume Estimates** - AI analyzes photos to estimate cubic yards of junk
- **Automatic Pricing** - Real-time price calculation based on AI volume estimates
- **Smart Lead Capture** - Collects contact info before showing estimates
- **Cloudinary Photo Upload** - Direct browser upload to cloud storage
- **Go High Level Ready** - Designed to integrate with your CRM

## Project Structure

```
fromscratch-site-build-junk/
├── junk-hauler-site/          # Main website (single source of truth)
│   ├── src/
│   │   ├── components/        # React components
│   │   │   └── lead-form/     # Multi-step quote form
│   │   ├── layouts/           # Astro layouts
│   │   ├── lib/               # Utilities and pricing logic
│   │   ├── pages/             # Routes and API endpoints
│   │   │   ├── api/           # Backend API routes
│   │   │   ├── quote/         # Quote form pages
│   │   │   └── index.astro    # Landing page
│   │   └── styles/            # Global CSS
│   ├── public/                # Static assets
│   │   └── images/            # Service photos
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Environment template
│   └── package.json           # Dependencies
└── README.md                  # This file
```

## Pages

- **Landing Page** (`/`) - Hero, services, benefits, service area, about, contact
- **AI Quote Form** (`/quote`) - 6-step lead capture with photo uploads
- **Quote Success** (`/quote/success`) - AI-generated estimates and pricing

## Services Offered

- Residential Junk Removal
- Commercial Junk Removal
- Construction Debris
- Storage Cleanouts
- Estate Cleanouts
- Yard Waste Removal

## Service Area

Boise, Meridian, Nampa, Eagle, Caldwell, Kuna, Star, Garden City, Middleton, Emmett (Ada & Canyon County)

## Contact Information

- **Phone**: 844-543-JUNK (844-543-5865)
- **Email**: team@junkhaulerboise.com
- **Owners**: Jason Leibler and Tanner Kauffman

## Environment Setup

Copy `.env.example` to `.env` in the `junk-hauler-site` directory and add your API keys:

```bash
cd junk-hauler-site
cp .env.example .env
```

Required environment variables:
- `ANTHROPIC_API_KEY` - Claude AI for photo analysis
- `PUBLIC_CLOUDINARY_CLOUD_NAME` - Photo storage
- `PUBLIC_CLOUDINARY_UPLOAD_PRESET` - Upload configuration

Optional:
- `GHL_API_KEY` - Go High Level CRM integration (future)

## Available Commands

All commands are run from the `junk-hauler-site` directory:

| Command           | Action                                       |
|-------------------|----------------------------------------------|
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start dev server at `localhost:4321`         |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview production build locally             |

## Deployment

This site is deployed on Vercel and configured to build from the `junk-hauler-site` directory.

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `junk-hauler-site`
4. Add environment variables in Vercel dashboard
5. Deploy

Vercel auto-detects Astro and uses the correct build settings.

## Tech Stack

- **[Astro](https://astro.build)** - Static site generator with islands architecture
- **[React](https://react.dev)** - Interactive UI components
- **[Tailwind CSS v4](https://tailwindcss.com)** - Utility-first CSS framework
- **[Anthropic Claude AI](https://www.anthropic.com)** - Vision AI for photo analysis
- **[Cloudinary](https://cloudinary.com)** - Cloud-based image storage
- **[React Hook Form](https://react-hook-form.com)** - Form state management
- **[Zod](https://zod.dev)** - Schema validation
- **[Vercel](https://vercel.com)** - Hosting and deployment

## Lead Management

Leads are captured through the quote form and logged to the console. The system is designed to integrate with Go High Level CRM for lead management and follow-up.

To integrate with Go High Level:
1. Get your GHL API key
2. Add `GHL_API_KEY` to `.env`
3. Uncomment the integration code in `src/pages/api/save-lead.js`

## License

Copyright © 2025 Junk Hauler Boise. All rights reserved.
