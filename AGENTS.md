# Repository instructions

- This repository is a build-free static PWA deployed from the repository root.
- Preserve the `travel-planner-app-data` localStorage key and existing data shapes unless a migration is implemented. Installed iPhone/iPad Home Screen apps must retain user data across code updates.
- For every change that affects the deployed app, increment the unique version in `version.js` in the same change. Use `YYYY.MM.DD.N` and increase `N` for additional releases on the same day.
- Keep application-shell URLs relative so deployment continues to work below a GitHub Pages repository path.
- Do not use cache-first navigation. `sw.js` intentionally uses network-first navigation with an offline fallback so installed Safari Home Screen apps receive new deployments without being removed and re-added.
