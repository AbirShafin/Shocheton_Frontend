

A modern, fast, and responsive frontend for a multi-agent AI debate system that verifies claims and surfaces verdicts with sources. Built with React, Vite, TanStack Router/Start, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** React 19 + TanStack Start & TanStack Router
- **Build Tool:** Vite + Nitro
- **Styling:** Tailwind CSS (v4) + Radix UI Primitives
- **Icons:** Lucide React
- **Language:** TypeScript
- **Deployment:** Vercel (via Nitro preset)

## 🧠 How It Works (The Flow)

This frontend acts as the user-facing client for a backend orchestrator that conducts multi-agent AI fact-checking.

1. **User Input:** The user submits a claim (text) or a file (PDF) via the `FactCheckForm` UI.
2. **Backend Communication (`src/lib/factcheck-api.ts`):** 
   - The frontend sends the payload to `VITE_FACTCHECK_API_URL`.
   - **Parallel Agent Processing:** It requests analysis from two different AI agents (`POST /agent1` and `POST /agent2`), which act as an Affirmative and Skeptic respectively.
   - **Moderator Synthesis:** Once both agents respond, the frontend passes their insights to the Moderator (`POST /moderator`), which generates a final verdict, confidence score, and factuality summary.
3. **Results Display:** The frontend renders the agents' debate and the moderator's final verdict in an interactive `ResultsPanel`. 

*(Note: The AI logic and integrations with OpenAI/Anthropic/Gemini are managed by a separate backend repository. This codebase manages the client experience and UI state.)*

## 📁 Project Structure

```text
.
├── src/
│   ├── assets/       # Static assets
│   ├── components/   # React components (UI building blocks & Fact-Check Views)
│   │   ├── ui/       # Reusable Radix/Shadcn UI components
│   │   ├── FactCheckForm.tsx
│   │   ├── ResultsPanel.tsx
│   ├── hooks/        # Custom React hooks (e.g., use-mobile)
│   ├── lib/          # Utilities, config, and API integrations
│   │   ├── factcheck-api.ts # Connects to the backend AI services
│   ├── routes/       # TanStack Router page routes
│   └── styles.css    # Global Tailwind styles
├── public/           # Public static files
├── package.json      # Dependencies and scripts
└── vite.config.ts    # Vite configuration & Vercel deployment setup
```

## 🛠️ Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory and add the URL for your backend API:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:8080`.*

4. **Lint and Format:**
   ```bash
   npm run lint
   npm run format
   ```

## 🌐 Deployment (Vercel)

This application is configured for seamless deployment on Vercel:

1. The `vite.config.ts` file includes instructions for Nitro to build edge-ready outputs `nitro: { preset: 'vercel' }`.
2. Push your code to a GitHub, GitLab, or Bitbucket repository.
3. Import the project into your Vercel Dashboard.
4. **Important Settings:**
   - **Build Command:** `npm run build`
   - **Environment Variables:** Set `VITE_FACTCHECK_API_URL` to your production `/api/v1/verify` endpoint.
   - The frontend appends `/api/v1/verify` to `VITE_API_BASE_URL`.
5. Deploy! Vercel will automatically trigger Nitro and serve the app optimally on the Edge.
