# Driver Hub

Driver Hub is a React + Vite web app for rideshare drivers who want a simple way to log shifts, track expenses, review weekly performance, and spot patterns in their work.

The app is built as a frontend-only project and stores data in the browser with `localStorage`, so it runs without a backend database.

## Features

- Dashboard with a 2-column layout
- Live local weather card using browser geolocation and Open-Meteo
- Earnings summary showing gross revenue, total expenses, gas, tolls, and net profit
- AI-style weekly insights generated from logged shift data
- Busiest week view on the dashboard, showing only the week with the most logged shifts
- Shift logging form for Uber and Lyft entries
- Recent shift preview that shows only the 3 most recently logged shifts on the Shift Log page
- Records page showing all logged shifts and all recorded weeks
- Delete shift functionality
- Persistent browser storage using `localStorage`

## Pages

### Dashboard
The dashboard is the main overview page. It shows:

- Weather
- Earnings summary
- AI weekly insights
- The single busiest week in your log history

### Shift Log
The Shift Log page is used for adding new shifts. It shows:

- Shift entry form
- The 3 most recent shifts only

### Records
The Records page is the full archive view. It shows:

- All logged shifts
- All weekly breakdowns

## Shift Data Tracked
Each shift can store:

- Platform (`Uber` or `Lyft`)
- Date
- Hours worked
- Earnings
- Gas cost
- Tolls cost
- Total expenses

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- React Icons
- Open-Meteo API

## Project Structure

```text
src/
  components/
    AIWeeklyInsights.jsx
    EarningsSummary.jsx
    NavBar.jsx
    RecordsOverview.jsx
    ShiftForm.jsx
    ShiftList.jsx
    WeatherCard.jsx
    WeeklyBreakdown.jsx
  utils/
    analytics.js
    formatters.js
    weather.js
  App.jsx
```

## How It Works

### Weather
The app uses browser geolocation to get the user's location and then calls Open-Meteo to show current local weather conditions.

### Weekly Analytics
Weekly data is grouped by the start of the week. The app calculates:

- Earnings by day
- Hours by day
- Expenses by day
- Gas and toll totals
- Which week has the most shifts

### AI Weekly Insights
The AI insights section is rule-based and generated locally from the user's shift history. It highlights patterns such as:

- Best earning day
- Strongest platform by hourly average
- Weekly take-home pace
- Whether gas or tolls are having a larger impact on profit

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## Data Storage

This project currently stores all shift data in the browser using:

- `localStorage`

Because of that:

- data stays on the same browser/device
- clearing browser storage will remove saved shifts
- there is no login or cloud sync yet

## Future Improvements

Possible next upgrades for the project:

- Real AI summaries using an API
- Weather saved per shift for weather-vs-earnings analysis
- Charts for weekly and monthly earnings
- Mileage tracking
- Export to CSV or PDF
- Driver account system with cloud storage

## Deployment

This project is deployed on Vercel.
[View Driver Hub Live](https://driver-hub-seven.vercel.app) 

## Notes

- Shift data is stored in browser localStorage
- No backend or database is required
- Weather uses Open-Meteo and browser geolocation

## Author Notes

This project is a strong example of a practical productivity app for gig drivers. It combines logging, analytics, weather context, and AI-style insights in a clean frontend workflow.

