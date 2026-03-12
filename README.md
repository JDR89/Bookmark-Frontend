# 🔖 Bookmarks App - Frontend

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4-764ABC?style=for-the-badge&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)

Welcome to the frontend repository of the **Bookmarks App** — a modern, fast, and secure web application designed to help users save, organize, and manage their internet bookmarks with ease. 

🌐 **Live Demo:** [bookmark-frontend-teal.vercel.app](https://bookmark-frontend-teal.vercel.app)

*(This is the Frontend layer of the application. The NestJS backend repository can be found on my GitHub profile).*

---

## 🚀 Features & Capabilities

- **Hybrid Authentication:** Seamless login flow utilizing Google OAuth 2.0 and JWT.
- **Guest Mode Architecture:** Allows users to try the app and interact with the UI using local mock data before committing to an account.
- **Advanced State Management:** Utilizes **Zustand** for global asynchronous state, avoiding prop-drilling and handling optimistic UI updates.
- **Next.js & React 19:** Built on the bleeding edge of the React ecosystem using the App Router.
- **Optimism & Resilience:** Custom Axios interceptors to handle silent token refreshing and Zero-Downtime deployments.
- **Hydration Safe:** Custom `useStore` hooks to ensure exact parity between Server-Side Rendering (SSR) and Client-Side state, completely eliminating React hydration mismatches.
- **Responsive UI:** Fully responsive dashboard crafted with Tailwind CSS and Shadcn UI components.

## 🏗️ Technical Architecture

This repository adopts a strict separation of concerns, heavily prioritizing maintainability and scalability:

- `app/`: Next.js 15 App Router definitions and page layouts.
- `components/`: Modular React components divided into "Landing" and "Dashboard" contexts, utilizing Shadcn UI.
- `store/`: Centralized Zustand stores for user sessions, workspaces, collections, and bookmarks logic.
- `lib/`: Core utilities, including the `api.ts` configured with interceptors to automatically attach Bearer Auth Tokens and intercept 401s for queue-based multi-request silent token renewal.

## ⚙️ Local Development

To run this project locally, you will need Node.js (v18+) and the corresponding Backend API running.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JDR89/Bookmark---Frontend.git
   cd Bookmark---Frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the URL of your local or production backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3008/api
   # For production: NEXT_PUBLIC_API_URL=https://your-railway-backend.app/api
   ```

4. **Start the development server:**
   ```bash
   pnpm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚢 Deployment

This frontend is designed to be effortlessly deployed on **Vercel** as a Serverless edge application.

The project relies on a decoupled Full-Stack architecture:
1. **Database:** PostgreSQL hosted securely on Railway (internal network).
2. **Backend Engine:** NestJS API running on Railway as a Long-Running Web Service.
3. **Frontend Edge:** This repository, distributed globally via Vercel CDNs, communicating with the backend over HTTPS.

## 🛡️ Security Decisions

- **Spam Prevention:** Traditional Email/Password registration has been disabled at the UI level. User onboarding is currently restricted to legitimate Google Accounts via OAuth 2.0 to protect the database against malicious bot scraping.
- **Stateless Sessions:** Only short-lived Access Tokens are handled by the frontend, reducing XSS vulnerabilities exposure.
