# Relay

Relay is a fast, modern project management application designed for teams that want to get things done without the bloat. Built with a Spring Boot backend and a React frontend, Relay focuses on core kanban workflows, issue tracking, multi-tenant organizations, and seamless collaboration.

## Features

- **Kanban Boards**: Drag-and-drop tasks between columns. Status updates persist instantly.
- **Multi-Tenant Orgs**: Create your organization, invite teammates with a code, and manage multiple projects under one roof.
- **Priority Tracking**: Tag tasks as Urgent, High, Medium, or Low. Color-coded badges make priorities impossible to miss.
- **Assignees & Comments**: Collaborate effectively by assigning tasks to teammates and leaving comments.
- **Instant Updates**: Click any card to view details, edit inline, and save—no page reloads.
- **Secure by Default**: JWT authentication, tenant isolation, and encrypted passwords. Your data stays yours.

## Tech Stack

### Backend
- **Framework**: Spring Boot (Java 21)
- **Database**: PostgreSQL
- **Authentication**: JWT, Spring Security
- **Architecture**: MVC (Controllers, Services, Repositories)

### Frontend
- **Framework**: React 19 (via Vite)
- **State Management**: Zustand
- **Routing**: React Router v7
- **Styling**: Vanilla CSS with curated Design Variables (`index.css`), leveraging Syncfusion UI elements under the hood.
- **Icons**: `lucide-react`
- **Drag & Drop**: `@dnd-kit/core`

## Setup & Installation

### Prerequisites
- Node.js & npm
- Java 17+ & Maven
- PostgreSQL

### 1. Database Setup
Create a PostgreSQL database named `relay` with user `relay` and password `relay` (or update `application.properties` with your credentials).

### 2. Backend Setup
Navigate to the `server` directory and run the Spring Boot app:
```bash
cd server
mvn spring-boot:run
```
The server will start on `http://localhost:3000`. Hibernate auto-ddl will automatically generate the schema on startup.

### 3. Frontend Setup
Navigate to the `client` directory, install dependencies, and build/run:
```bash
cd client
npm install
npm run dev
```
Alternatively, `npm run build` will compile the static assets and copy them to the Spring Boot resources directory, allowing you to serve the full app from `http://localhost:3000`.

## Design Philosophy

Relay is built on the philosophy of **"Everything you need, nothing you don't"**.
No complex charts, no timesheets, no 47-tab settings page. Just the tools you actually use every day.
