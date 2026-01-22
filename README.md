# Kollab

## CI/CD
GitHub Actions runs on every push and pull request for `dev` and `master`:
- Linting
- Unit tests
- Build (client)

## GitHub Pages (client)
The Pages workflow deploys the Vite client to:
- `master`: `https://<your-username>.github.io/kollab/`
- `dev`: `https://<your-username>.github.io/kollab/dev/`

### One-time GitHub setup
1. Go to **Settings → Pages**.
2. **Source**: select **Deploy from a branch**.
3. **Branch**: choose **gh-pages** and **/(root)**, then save.
4. Ensure Actions are enabled for the repository.

### Notes
- Deploys trigger on **push** to `dev` or `master` (including merge from `dev` to `master`).
- The client base path is set automatically by the workflow with `VITE_BASE_PATH`.
