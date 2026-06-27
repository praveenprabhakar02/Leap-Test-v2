# Leap — Personal Health OS Demo

A mobile-first interactive prototype that demonstrates how Leap can combine fragmented health signals, explain personalized recommendations, and turn patterns into small experiments.

## Included flow

- Welcome and demo-data safety message
- Multi-select goals with a primary goal
- Health-area prioritization
- Multi-select wearable research question
- Personalized demo loading state
- Daily brief and cross-source evidence
- Recommendations with explanation and simulated reminders
- Health-area details
- Goal-ranked insights with confidence and evidence
- Seven-day experiment setup and active experiment state
- Session persistence through `localStorage`

All health information is fictional sample data. No account, backend, or real device connection is used.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. The interface is designed for a 390 × 844 mobile viewport and also works as a centered phone experience on desktop.

## Production build

```bash
npm run build
npm run preview
```

The deployable static output is created in `dist/`.

## Deploy

### Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.

### Netlify

1. Push this folder to GitHub.
2. Create a site from the repository.
3. Build command: `npm run build`.
4. Publish directory: `dist`.

### GitHub Pages

The Vite base is relative and navigation uses URL hashes, so the generated `dist/` folder can be deployed under a repository subpath without route rewrites.

## Reset the demo

On desktop, use **Reset demo** in the upper-right corner. On a phone, clear local browser storage or return to the welcome hash and restart. Demo choices are intentionally stored in the current browser so testers can move around without losing their selections.

## Technology

- React
- TypeScript
- Vite
- Lucide icons
- Custom responsive CSS

## Important prototype limitations

- No real health data or wearable connections
- No medical advice or diagnosis
- No real notification registration
- No backend, authentication, or analytics
- Experiment results are illustrative only
