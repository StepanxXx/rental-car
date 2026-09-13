# RentalCar — Car Rental Application

RentalCar is a responsive car rental application built with Next.js and
TypeScript. Users can browse a server-filtered catalog, progressively load more
cars, open a detailed car page, and submit a rental request.

## Features

- Home page with a hero section and a **View Catalog** call to action
- Catalog populated from the Rental Car API
- Server-side filtering by brand, hourly price, and mileage range
- Filters synchronized with URL search parameters
- **Load more** pagination powered by TanStack Query `useInfiniteQuery`
- Server-prefetched catalog data hydrated on the client
- Car details pages opened from catalog cards in a new browser tab
- Rental request form validated with Yup
- Persisted form drafts powered by Zustand
- Success and error notifications powered by React Hot Toast
- Loading, empty, not-found, and API error states
- Page-specific SEO, Open Graph, and Twitter metadata

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- TanStack React Query
- Axios
- Zustand
- Yup
- Radix UI Select
- React Icons
- React Hot Toast
- SimpleBar
- CSS Modules
- ESLint and Prettier

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/StepanxXx/rental-car.git
cd rental-car
npm install
```

Create a `.env` file in the project root. The API URL is required:

```env
NEXT_PUBLIC_CAR_RENTAL_URL=https://car-rental-api.goit.study
```

Optional environment variables:

```env
# Public deployment URL used to generate absolute metadata URLs
NEXT_PUBLIC_SITE_URL=https://your-site.example.com

# Additional origin allowed by the Next.js development server
NEXT_DEV_ORIGIN=your-dev-host.example.com
```

Start the development server:

```bash
npm run dev
```

The application will be available at
[http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the development server                 |
| `npm run build`        | Create an optimized production build         |
| `npm run start`        | Start the previously built production server |
| `npm run lint`         | Check the project with ESLint                |
| `npm run format`       | Format supported files with Prettier         |
| `npm run format:check` | Check formatting without modifying files     |

## Routes

| Route              | Description                         |
| ------------------ | ----------------------------------- |
| `/`                | Home page                           |
| `/catalog`         | Filterable, paginated car catalog   |
| `/catalog/[carId]` | Car details and rental request form |

## API Integration

The Axios client in `lib/api.ts` reads its base URL from
`NEXT_PUBLIC_CAR_RENTAL_URL` and supports these requests:

- `GET /cars` — retrieve cars with pagination and filters
- `GET /cars/filters` — retrieve available brands and the price range
- `GET /cars/:id` — retrieve a specific car
- `POST /cars/:id/booking-requests` — submit a rental request

Catalog filters are sent to the backend as `brand`, `price`, `minMileage`, and
`maxMileage` query parameters. Pagination uses `page` and `perPage`; every
additional page is requested with the currently active filters.

## Architecture Notes

- The project uses the Next.js App Router and React Server Components by
  default.
- `app/catalog/(overview)` is a route group for the catalog overview. Its
  `@content` parallel route keeps the filter controls and car results separated
  without adding a URL segment.
- `app/catalog/[carId]` is outside the overview group, so the details page does
  not inherit the catalog filter layout.
- The first catalog page is prefetched on the server, dehydrated, and restored
  inside `HydrationBoundary`. Further pages are fetched in the client with
  `useInfiniteQuery`.
- Filter values are stored in Zustand and mirrored in the URL, so filtered
  catalog views can be bookmarked or shared.
- Rental form drafts are persisted in local storage independently for every car.

## Project Structure

```text
app/
  catalog/
    (overview)/       Catalog filters, parallel results slot, and error states
    [carId]/          Dynamic car details page
  layout.tsx          Root layout and providers
  page.tsx            Home page
components/           Reusable UI components
lib/
  store/              Zustand stores
  api.ts              Axios requests
  carFilters.ts       Filter parsing and URL serialization
  queries.ts          Shared TanStack Query options
public/               Images and SVG sprite
types/                TypeScript domain models
swagger.json          Backend OpenAPI specification
```

## Quality Checks

```bash
npm run lint
npm run format:check
npx tsc --noEmit
npm run build
```

## Author

[StepanxXx](https://github.com/StepanxXx)
