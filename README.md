<div align="center">

# FinSim

**An interactive financial education simulator for young people.**

Learn to manage money through practical scenarios, with no real-world risk.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-.NET_8-512BD4?logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Languages](https://img.shields.io/badge/languages-RO%20%7C%20EN%20%7C%20RU-informational)

</div>

---

## Table of contents

- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)

## About

FinSim helps young people build financial skills by playing through realistic situations such as receiving a first salary, choosing a loan or building an emergency fund. Every decision has consequences, and every scenario ends with a score and a final balance, so mistakes become lessons instead of losses.

The interface is available in **Romanian, English and Russian**, with light and dark themes.

## Features

**Scenarios**
- Step-by-step financial situations with multiple-choice decisions, budget allocation, true/false questions and loan offer comparisons.
- Each scenario ends with a score and a final balance.
- Some scenarios are open to everyone, others require an account.

**Learning resources**
- A library of PDF materials and videos grouped by topic: budgeting, savings, financial decisions and credit.

**Progress and community**
- A personal profile with scenario history and statistics.
- A progress page with score charts and achievements.
- A leaderboard of the top players.
- User reviews with star ratings.

**Notifications and contact**
- Notifications about account and platform activity.
- A contact form for questions and feedback, with replies delivered as notifications.

**Also included**
- FAQ, About and Terms pages.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, TanStack Router, react-i18next |
| Backend | ASP.NET Core (.NET 8), Entity Framework Core |
| Database | PostgreSQL 16 |
| Tooling | Docker, GitHub Actions |

## Project structure

```
client/                web application (React)
server/                API (ASP.NET Core) and data access
docker-compose.yml     PostgreSQL database
```

## Getting started

### Prerequisites

- [.NET SDK 8](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (LTS)
- [Docker](https://www.docker.com/)
- EF Core tools: `dotnet tool install --global dotnet-ef`

### Installation

**1. Start the database**

```bash
docker compose up -d
```

**2. Configure the backend**

Provide the configuration values required by the API (see the API project's settings). Email delivery must be configured for the confirmation codes sent by the app.

**3. Apply the database migrations**

```bash
cd server/FinSim
dotnet ef database update --project FinSimWeb.DataAccessLayer --startup-project FinSimWeb.Api
```

**4. Start the API**

```bash
dotnet run --project FinSimWeb.Api
```

The API runs on `http://localhost:5070` by default.

**5. Start the web app**

```bash
cd client
npm install
npm run dev
```

The app opens at `http://localhost:5173`. The API address is set with the `VITE_API_BASE_URL` variable in `client/.env.development`.

## Available scripts

Run from the `client` directory:

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type check and build for production |
| `npm run lint` | Run code checks |
| `npm run preview` | Preview the production build |

On every push, GitHub Actions builds both the backend and the frontend.
