# NHS Vaccine Add-in Deployment Instructions

## Render Deployment Settings

When deploying this application to Render, please ensure the following settings are configured correctly:

### Static Site Configuration
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Environment Variables**: 
  - `REACT_APP_API_URL`: `https://nhs-vaccine-backend.onrender.com/api/vaccine`

### Important Notes
1. The `build` directory must be specified as the publish directory, as this is where webpack outputs all the compiled files.
2. All assets (images, manifest.xml, etc.) are copied to the build directory during the build process.
3. Make sure the deployment has completed successfully before testing the add-in.

## Troubleshooting 404 Errors

If you encounter 404 errors when loading the add-in:

1. Verify that the deployment has completed successfully on Render.
2. Check that the publish directory is set to `build` (not `dist` or any other directory).
3. Confirm that the URLs in the manifest.xml file match your Render deployment URL.
4. Try accessing the index.html file directly in your browser (e.g., https://nhs-vaccine-frontend.onrender.com/index.html).
5. Check if assets are accessible by directly accessing them (e.g., https://nhs-vaccine-frontend.onrender.com/assets/logo_64x64.png).

## Verifying Deployment

After deployment, you should be able to access:
- The main application: https://nhs-vaccine-frontend.onrender.com/index.html
- Assets: https://nhs-vaccine-frontend.onrender.com/assets/logo_64x64.png
- Manifest: https://nhs-vaccine-frontend.onrender.com/manifest.xml

## Local Development

For local development:

```bash
npm install
npm run install-certs  # Only needed once for HTTPS development
npm start
``` 