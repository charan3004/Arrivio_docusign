# Deployment Guide for Arrivio

This guide covers how to deploy the Arrivio full-stack application.
- **Database**: Supabase (PostgreSQL)
- **Backend**: Render (Express.js)
- **Frontend**: Vercel (React/Vite)

## 1. Database Setup (Supabase)

1.  **Create a Project**:
    *   Go to [Supabase](https://supabase.com/) and create a new project.
    *   Save your database password.

2.  **Get Connection String**:
    *   Go to **Project Settings** -> **Database** -> **Connection string** -> **URI**.
    *   It will look like: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`
    *   Replace `[PASSWORD]` with your actual password.

3.  **Run Migrations & Seed Data**:
    You can initialize the database from your local machine.
    
    *   Create a `.env` file in the `server` directory (if not exists) and add:
        ```env
        DATABASE_URL="your_supabase_connection_string_here"
        ```
    *   Open a terminal in the project root and run:
        ```bash
        # Install dependencies
        cd server
        npm install

        # Run Migrations (Creates Tables)
        node scripts/run-migrations.js

        # Seed Data (Adds sample properties)
        node scripts/seed_full_data.js
        ```
    *   *Alternative*: You can copy the content of `server/scripts/migrations.sql` and run it in the Supabase SQL Editor.

## 2. Backend Deployment (Render)

1.  **Create a Web Service**:
    *   Go to [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.

2.  **Configuration**:
    *   **Root Directory**: `server`
    *   **Runtime**: Node
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    
3.  **Environment Variables**:
    Add the following environment variables in the Render dashboard:
    *   `DATABASE_URL`: Your Supabase connection string.
    *   `JWT_SECRET`: A long random string (e.g., generated via `openssl rand -hex 32`).
    *   `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.

4.  **Deploy**:
    *   Click **Create Web Service**.
    *   Wait for the deployment to finish.
    *   Copy the **Service URL** (e.g., `https://arrivio-backend.onrender.com`).

## 3. Frontend Deployment (Vercel)

1.  **Create a Project**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **Add New...** -> **Project**.
    *   Import your GitHub repository.

2.  **Configuration**:
    *   **Framework Preset**: Vite (should be detected automatically).
    *   **Root Directory**: `.` (default).

3.  **Environment Variables**:
    *   Expand the **Environment Variables** section.
    *   Add:
        *   `VITE_API_URL`: The URL of your deployed Backend (e.g., `https://arrivio-backend.onrender.com`).
        *   `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID (optional, if you want Google Login).

4.  **Deploy**:
    *   Click **Deploy**.
    *   Vercel will build and deploy your site.

## Troubleshooting

*   **Database Connection Errors**: Ensure you have `?sslmode=require` or similar if needed, but the backend code is configured to handle SSL automatically when `DATABASE_URL` is present.
*   **CORS Issues**: If the frontend cannot talk to the backend, ensure the backend allows requests from the frontend domain. (Currently configured to allow all origins).
