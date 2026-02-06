# Edulink AI Translator

White-and-blue themed AI translator with voice input, built with React (Vite) on the frontend and FastAPI on the backend.

## Backend Setup (FastAPI)

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Run the backend locally:**
   ```bash
   python backend_server.py
   ```
   The server will start at `http://localhost:8000` with docs at `http://localhost:8000/docs`.

## Frontend Setup (Vite + React)

1. **Install Node dependencies:**
   ```bash
   npm install
   ```
2. **Configure backend URL:**
   Create a `.env` file in the project root:
   ```bash
   echo VITE_API_URL=http://localhost:8000 > .env
   ```
   When you deploy, change this to the public URL of your FastAPI backend.

3. **Run the frontend dev server:**
   ```bash
   npm run dev
   ```
   Open the printed `http://localhost:5173` URL in your browser.

## GitHub & Vercel Deployment

The remote GitHub repository `EricSyamir/edulinktranslator` is already created (`https://github.com/EricSyamir/edulinktranslator`).

### 1. Initialize Git and push to GitHub

Run these commands from the project root:

```bash
git init
git add .
git commit -m "Initial Edulink translator app"
git branch -M main
git remote add origin https://github.com/EricSyamir/edulinktranslator.git
git push -u origin main
```

> Make sure you are logged in with Git on this machine (GitHub CLI or HTTPS with your credentials / PAT).

### 2. Deploy frontend to Vercel

1. Go to the Vercel dashboard and click **New Project**.
2. Import the `edulinktranslator` repo from GitHub.
3. Framework preset: **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. In **Environment Variables**, add:
   - `VITE_API_URL` = public URL of your FastAPI backend (for local-only use you can keep `http://localhost:8000`, but a public URL is required for others to use it).
7. Click **Deploy**.

Once deployed, Vercel will give you a public URL where the white-and-blue translator UI is available.
