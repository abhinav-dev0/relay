# Relay

Relay is a fast, modern, and beautiful project management application designed for teams that want to get things done without the bloat. Built with a robust **Spring Boot** backend and a responsive **React 19** frontend, Relay focuses on core kanban workflows, issue tracking, multi-tenant organizations, and seamless collaboration.

## 🔗 Live Demo
* **Live App**: [https://web-relay.netlify.app/](https://web-relay.netlify.app/)

<img width="1711" height="848" alt="Relay Dashboard Screenshot" src="https://github.com/user-attachments/assets/85e14087-985e-46bd-8f95-574635df984e" />

---

## ✨ Key Features

- **📋 Kanban Boards**: Drag-and-drop tasks between columns with instant, persistent state updates.
- **🏢 Multi-Tenant Organizations**: Create organizations, invite teammates using secure invite codes, and manage multiple projects under one roof.
- **⚠️ Priority Tracking**: Tag tasks with color-coded priority badges (Urgent, High, Medium, Low) for high-visibility management.
- **💬 Assignment & Comments**: Assign issues to teammates and collaborate in real-time with inline commenting.
- **⚡ Instant Updates**: View, edit, and save task details inline without reloading pages.
- **🔒 Security by Design**: Robust JWT-based authentication, complete tenant isolation, and encrypted passwords.

---

## 🛠️ Tech Stack

### Backend
* **Framework**: Spring Boot 4.0 (Java 21)
* **Database**: PostgreSQL
* **Security & Auth**: JWT & Spring Security
* **Architecture**: MVC (Controller, Service, Repository) with Hibernate JPA

### Frontend
* **Core**: React 19 (via Vite)
* **State Management**: Zustand
* **Routing**: React Router v7
* **Styling**: Vanilla CSS with curated Design Variables (`index.css`), leveraging Syncfusion UI elements
* **Icons**: `lucide-react`
* **Drag & Drop**: `@dnd-kit/core`

---

## 🚀 Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) & npm
* [Java 21 JDK](https://adoptium.net/) & Maven
* [PostgreSQL](https://www.postgresql.org/)

---

### Option A: Standard Manual Execution

#### 1. Database Configuration
Create a PostgreSQL database named `relay`. You can run a PostgreSQL server locally. By default, the app expects:
* **Database Name**: `relay`
* **Username**: `relay`
* **Password**: `relay`

#### 2. Backend Startup
Navigate to the `server` directory and run the Spring Boot application:
```bash
cd server
./mvnw spring-boot:run
```
The server will start on `http://localhost:3000`. Database schemas are automatically generated on startup via Hibernate DDL auto-update.

#### 3. Frontend Startup
Navigate to the `client` directory, install dependencies, and start the development server:
```bash
cd client
npm install
npm run dev
```
The client will start on `http://localhost:5173`. It is configured to proxy API requests to `http://localhost:3000`.

---

### Option B: Running with Docker (Recommended)

You can build and run the backend inside a containerized environment.

#### 1. Build the Backend Docker Image
Navigate to the `server` directory and build the Docker image:
```bash
cd server
docker build -t relay-backend .
```

#### 2. Run the Container
Run the container, exposing port `3000` and providing your database configurations:
```bash
docker run -p 3000:3000 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/relay \
  -e SPRING_DATASOURCE_USERNAME=your_db_username \
  -e SPRING_DATASOURCE_PASSWORD=your_db_password \
  -e JWT_SECRET=your_long_super_secure_jwt_secret_key_here_12345 \
  relay-backend
```
*(Note: `host.docker.internal` allows the container to connect to a PostgreSQL database running on your host machine).*

---

## ☁️ Production Deployment

Relay is built following 12-factor app principles and is optimized for multi-service deployments (e.g., **Render** for the backend, **Netlify** for the frontend).

### 1. Backend Deployment (Render)

Render supports Docker deployments natively, making it easy to spin up our Spring Boot container.

#### Steps:
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your Git repository.
4. Set the following configuration parameters:
   * **Language**: `Docker`
   * **Root Directory**: `server` *(Important: Since this is a monorepos structure, setting the root directory to `server` ensures Render builds with the correct Maven context)*.
   * **Dockerfile Path**: `Dockerfile`
5. Go to the **Environment** tab and add the Environment Variables specified in the [configuration table below](#-environment-variables).

---

### 2. Frontend Deployment (Netlify)

Since Relay is a React SPA, it is deployed as static assets. We have prepared two configurations to handle communication with the Render backend:

#### Option 1: Netlify Proxy Rewrite (Recommended)
This method allows the frontend to request `/api/*` directly from Netlify. Netlify's CDN proxies the requests to the Render backend, preventing CORS errors completely.
1. Update [client/public/_redirects](client/public/_redirects):
   ```text
   /api/*  https://your-render-backend.onrender.com/api/:splat  200!
   /*      /index.html                                  200
   ```
2. Commit and deploy. The frontend will now securely proxy calls to Render.

#### Option 2: Build-Time Environment Variable
1. In Netlify's Site Settings, set the environment variable:
   * **Key**: `VITE_BASE_URL`
   * **Value**: `https://your-render-backend.onrender.com`
2. **Trigger a deploy (Clear cache & deploy)**. Vite will build the production JS bundles and inject the API URL dynamically.

---

### ⚙️ Environment Variables

Configure these variables in your hosting provider dashboards:

| Service | Environment Variable | Purpose | Recommended Value |
| :--- | :--- | :--- | :--- |
| **Backend** | `SPRING_DATASOURCE_URL` | JDBC Connection URL to your database | `jdbc:postgresql://<host>:<port>/<db_name>` *(Render databases require converting `postgres://` to `jdbc:postgresql://`)* |
| **Backend** | `SPRING_DATASOURCE_USERNAME` | Production Database User | (Retrieved from your database provider) |
| **Backend** | `SPRING_DATASOURCE_PASSWORD` | Production Database Password | (Retrieved from your database provider) |
| **Backend** | `JWT_SECRET` | 256-bit strong key for signing JWTs | A secure random alphanumeric string |
| **Backend** | `JWT_EXPIRY` | Token lifespan in milliseconds | `3600000` (1 hour) |
| **Backend** | `CORS_ALLOWED_ORIGINS` | Permitted cross-origin hosts | `https://your-netlify-app.netlify.app` (Your Netlify frontend domain) |
| **Frontend** | `VITE_BASE_URL` | Target address of backend server | `https://your-render-backend.onrender.com` (If not using proxy rewrites) |

---

## 🎨 Design Philosophy

Relay is built on the philosophy of **"Everything you need, nothing you don't"**.
No complex burndown charts, no timesheets, no 47-tab settings pages. Just clean, snappy, and responsive tools that developers and managers actually use every day.
