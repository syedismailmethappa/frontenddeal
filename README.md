# ShopSpot Showcase Frontend

A React + Vite application for comparing and finding the best deals across various e-commerce platforms.

## Quick Start for Development

```powershell
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Deployment to Render

### Environment Variables

Create these in your Render dashboard:
```env
VITE_API_BASE_URL=https://fullstack-dealshop00.onrender.com/
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Build and Start Commands

Build Command:
```bash
npm install && npm run build
```

Start Command:
```bash
npm run preview
```

### Important Settings

In your Render dashboard:
1. Set Build Command: `npm install && npm run build`
2. Set Start Command: `npm run preview`
3. Add all environment variables
4. Set Auto-Deploy: Yes

## Development Commands

```powershell
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/bdf05046-a474-4ca8-bdca-3a101aed349a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
