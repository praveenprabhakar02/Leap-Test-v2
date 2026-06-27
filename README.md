# leap. mobile prototype

A prebuilt, mobile-first prototype of the leap. personal Health OS.

## Publish with GitHub Pages

1. Create an empty GitHub repository.
2. Upload or push **everything in this folder** to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your default branch (usually `main`) and the folder **`/(root)`**, then save.

The published site works directly from a GitHub project URL such as:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

The production site is already compiled at the repository root. No GitHub Action, server, environment variable, or build command is required.

## Run locally

Because the root is a static production build, serve it with any local static server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

Opening `index.html` directly as a local file may be blocked by browser security rules, so use a local server.

## Edit the React app

The editable React + TypeScript + Vite project is in `source/`.

```bash
cd source
npm install
npm run dev
```

After making changes, rebuild and copy the output back to the repository root:

```bash
npm run build
cp -R dist/* ../
```

Commit both the source changes and the rebuilt root files.

## Prototype behavior

- Designed for mobile browsers
- Full-width mobile layout below 520px
- iPhone safe-area support
- Hash-based navigation, so refreshes work on GitHub Pages
- Relative asset paths, so it works under repository subpaths
- Demo choices persist in browser local storage
- No backend, login, analytics, or real health-data connection
