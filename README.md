# Junk Hauler Boise - Website

Modern, responsive landing page for Junk Hauler Boise, a professional junk removal service in the Treasure Valley.

## Features

- **Modern Design**: Built with Astro and Tailwind CSS
- **AI-Powered Quote System**: Multi-step lead form with Claude AI photo analysis
- **Instant Cubic Yard Estimates**: AI analyzes junk photos and estimates volume
- **Automatic Pricing**: Real-time pricing calculation with realistic ranges
- **Smart Lead Capture**: Collects contact info before showing estimates
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Fast Performance**: Static site generation for lightning-fast loading
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Professional Styling**: Custom fonts (Lexend + Inter) and polished UI

## Pages

- **Landing Page**: Hero section, services, benefits, service area, CTA, about, and footer
- **AI Quote Form** (`/quote`): 6-step lead capture form with photo uploads and instant AI estimates
- **Quote Success** (`/quote/success`): Displays AI-powered cubic yard estimates and pricing ranges

## Services Highlighted

- Residential Junk Removal
- Commercial Junk Removal
- Construction Debris
- Storage Cleanouts
- Estate Cleanouts
- Yard Waste Removal

## Service Area

Boise, Meridian, Nampa, Eagle, Caldwell, Kuna, Star, Garden City, Middleton, and Emmett

## Contact

- Phone: 844-543-JUNK (844-543-5865)
- Email: team@junkhaulerboise.com

## 🚀 Project Structure

```text
/
├── public/
│   └── images/         # All junk removal service photos
├── src/
│   ├── layouts/
│   │   └── Layout.astro    # Main layout with fonts and styles
│   ├── pages/
│   │   └── index.astro     # Landing page
│   └── styles/
│       └── global.css      # Tailwind CSS imports
└── package.json
```

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |

## Deployment

This site is designed to be deployed on Vercel:

1. Push this repository to GitHub
2. Import the project in Vercel
3. Vercel will auto-detect Astro and deploy

See `DEPLOYMENT_INSTRUCTIONS.md` in the parent directory for detailed steps.

## Tech Stack

- [Astro](https://astro.build) - Static Site Generator
- [React](https://react.dev) - Interactive UI Components
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Anthropic Claude AI](https://www.anthropic.com) - AI Photo Analysis & Volume Estimation
- [Cloudinary](https://cloudinary.com) - Photo Upload & Storage
- [React Hook Form](https://react-hook-form.com) - Form State Management
- [Zod](https://zod.dev) - Schema Validation

## License

Copyright © 2025 Junk Hauler Boise. All rights reserved.
