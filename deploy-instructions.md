# NHS Vaccine Add-in Frontend Deployment Instructions

## Deployment to Render

1. Go to the Render dashboard: https://dashboard.render.com
2. Click "New +" and select "Static Site"
3. Connect your GitHub repository
4. Configure the deployment:
   - Name: `nhs-vaccine-frontend`
   - Branch: `master` (or your main branch)
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
   - Environment Variables: 
     - `REACT_APP_API_URL`: `https://nhs-vaccine-backend.onrender.com/api/vaccine`

## Important Notes

- The backend API is already deployed at: `https://nhs-vaccine-backend.onrender.com`
- The webpack configuration has been updated to use this backend URL by default
- Certificate installation is skipped in production to avoid build errors on Render

## Local Development

For local development:

```bash
npm install
npm run install-certs  # Only needed once for HTTPS development
npm start
``` 