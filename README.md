# RentalCar

A web application for finding and renting cars. The project is built with
Next.js, TypeScript, React Query, and CSS Modules.

## Current Status

- Responsive home page with a hero section
- Shared header and navigation between pages
- `/catalog` route (currently a placeholder)
- Configured API client for cars, filters, and rental requests
- React Query and React Query Devtools integration
- Open Graph and Twitter metadata

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- TanStack React Query
- Axios
- Zustand
- CSS Modules
- ESLint and Prettier

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone <repository-url>
cd rental-car
npm install
```

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_CAR_RENTAL_URL=https://your-api.example.com
```

You can also provide the following optional variables:

```env
# Public site URL used in metadata
NEXT_PUBLIC_SITE_URL=https://your-site.example.com

# Allowed origin for local development
NEXT_DEV_ORIGIN=your-dev-host.example.com
```

Start the development server:

```bash
npm run dev
```

The application will be available at
[http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the local development server       |
| `npm run build`        | Create a production build                |
| `npm run start`        | Start the production server              |
| `npm run lint`         | Check the code with ESLint               |
| `npm run format`       | Format files with Prettier               |
| `npm run format:check` | Check formatting without modifying files |

## Routes

| Route      | Description                  |
| ---------- | ---------------------------- |
| `/`        | Home page                    |
| `/catalog` | Car catalog (in development) |

## API Integration

The API base URL is configured through the `NEXT_PUBLIC_CAR_RENTAL_URL`
environment variable. The client in `lib/api.ts` supports the following
requests:

- `GET /cars` — retrieve cars with pagination and filters
- `GET /cars/filters` — retrieve available brands and the price range
- `GET /cars/:id` — retrieve a specific car
- `POST /cars/:id/booking-requests` — submit a rental request

## Project Structure

```text
app/          Pages, layout, and global styles
components/   Reusable React components
lib/          API client and utility functions
public/       Static images and SVG files
types/        TypeScript domain types
swagger.json  API specification
```

## Pre-release Checks

```bash
npm run lint
npm run format:check
npm run build
```
