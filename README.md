# Asha Sewing Machine & Repairing

A full-stack e-commerce platform built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**.

## Features

- Product browsing, sorting, filtering, and search
- Product details with image gallery
- Shopping cart, checkout flow, and order confirmation
- Authentication (name + mobile) with JWT session
- User profile and order history
- Basic admin dashboard to manage products and orders
- Responsive design optimized for mobile and desktop

## Getting started

### 1) Install dependencies

```bash
npm install
cd server
npm install
```

### 2) Configure backend

Copy the sample env file and update as needed:

```bash
cp server/.env.example server/.env
```

Start a local MongoDB instance (e.g., using MongoDB Community or Atlas).

### 3) Run the backend and frontend

In one terminal (backend):

```bash
cd server
npm run dev
```

In another terminal (frontend):

```bash
npm run dev
```

The frontend app will run at http://localhost:5173 and proxy API requests to http://localhost:5000.

## Admin access

To access the admin dashboard, log in with the mobile number `0000000000`. That user will be granted admin privileges.

## Project structure

- `src/` — React frontend (components, pages, context, hooks)
- `server/` — Express backend (routes, models, authentication)
- `server/seed/` — Seed data for example products

## Notes

- This application is intended as a prototype and can be extended with features like real payment integration, order tracking, and a richer admin panel.
