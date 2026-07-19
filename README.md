# 🌦️ Weather Forecast App

A modern full-stack client-server weather application built with **React**, **NestJS**, **GraphQL**, **PostgreSQL**, and **Docker**.

The application allows users to securely manage their favorite cities and view detailed weather forecasts, including current conditions, hourly forecasts, and daily forecasts. Weather data is retrieved from the OpenWeather API through a dedicated NestJS backend, which handles authentication, business logic, and communication with external services.

The project follows **SOLID principles** and a modular architecture to ensure scalability, maintainability, and clean code.

> **⚠️ Portfolio Project**
>
> This repository is intended to showcase the project's architecture, code quality, and development practices.
> A live demo is not available because the application depends on Docker infrastructure, external services, and private environment variables (API keys and JWT secrets).

---

# ✨ Features

- 🔐 User authentication and authorization (JWT + HTTP-only Cookies)
- 🌍 Search weather by city
- ⭐ Save favorite cities
- 📌 Pin and unpin favorite locations
- 🌤 Current weather conditions
- 🕒 Hourly weather forecast
- 📅 Daily weather forecast
- 📱 Responsive user interface
- 🔍 GraphQL API
- ✅ Form validation
- 🏗 Modular architecture
- 🐳 Dockerized application

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Apollo Client
- GraphQL
- React Router
- React Hook Form
- Zod
- Ant Design (Antd)

---

## Backend

- Node.js
- NestJS
- Apollo Server (GraphQL)
- TypeORM
- PostgreSQL
- JWT Authentication
- Passport.js
- Cookie Parser
- Zod

---

## APIs & Infrastructure

- OpenWeather API
- Docker
- Docker Compose
- Git
- GitHub

---

## Code Quality

- ESLint
- Prettier
- Husky
- lint-staged
- SOLID Principles
- Modular Architecture

---

# 🏛 Architecture

```
                   ┌──────────────────────┐
                   │     React Client     │
                   └──────────┬───────────┘
                              │
                       Apollo Client
                              │
                           GraphQL
                              │
                   ┌──────────▼───────────┐
                   │    NestJS Backend    │
                   └──────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
 Authentication          Weather Module        Cities Module
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                          TypeORM
                              │
                        PostgreSQL
                              │
                     OpenWeather API
```

---

# 📁 Project Structure

```
weather-forecast-app
│
├── client/                 # React application
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/                 # NestJS backend
│   ├── src/
│   └── ...
│
├── docker-compose.yml
├── README.md
└── ...
```

---

# 🐳 Running Locally

The project is fully containerized using **Docker**.

```bash
git clone https://github.com/your-username/weather-forecast-app.git

cd weather-forecast-app

docker compose up --build
```

Before starting the application, configure the required environment variables:

- OpenWeather API Key
- JWT Secrets
- Database Configuration

---

# 📚 What This Project Demonstrates

This project showcases practical experience with:

- Full-Stack Development
- React
- TypeScript
- Node.js
- NestJS
- GraphQL
- PostgreSQL
- TypeORM
- Docker
- Authentication & Authorization
- REST API Integration
- OpenWeather API Integration
- SOLID Principles
- Clean Architecture
- Responsive UI Development
- Form Validation
- Git Workflow

---

# 📌 Repository Purpose

This repository is part of my software development portfolio.

Its purpose is to demonstrate my ability to design and develop modern full-stack applications using industry-standard technologies and best practices.

The focus of this project is on:

- clean architecture
- scalable application design
- secure authentication
- API integration
- maintainable code
- modern development workflow

---

# 📄 License

This project was created for educational and portfolio purposes.
