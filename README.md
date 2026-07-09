# Driver Hub

Driver Hub is a React + Vite web app for rideshare drivers who want a simple way to log shifts, track expenses, review weekly performance, and get AI-powered driving insights.

The app is a React frontend backed by a lightweight serverless API (deployed on Vercel) for its AI assistant. Shift data itself stays entirely in the browser via `localStorage` — no database or account system is required to use the app.

## Features

* Dashboard with a 2-column layout
* Live local weather card using browser geolocation and Open-Meteo, showing current conditions **and a 3-day forecast**
* Earnings summary showing gross revenue, total expenses, gas, tolls, and net profit
* Rule-based weekly insights generated locally from logged shift data (best day, strongest platform, expense breakdown, take-home pace)
* **AI Driver Copilot chatbot** powered by Google Gemini — ask natural-language questions about your shift history, seasonal demand trends, and NYC traffic bottlenecks
* Busiest week view on the dashboard, showing only the week with the most logged shifts
* Shift logging form for Uber and Lyft entries
* Recent shift preview that shows only the 3 most recently logged shifts on the Shift Log page
* Records page showing all logged shifts and all recorded weeks
* Delete shift functionality
* Persistent browser storage using `localStorage`

## Pages

### Dashboard

The dashboard is the main overview page. It shows:

* Weather (current + 3-day forecast)
* Earnings summary
* AI Driver Copilot chat assistant
* The single busiest week in your log history

### Shift Log

The Shift Log page is used for adding new shifts. It shows:

* Shift entry form
* The 3 most recent shifts only

### Records

The Records page is the full archive view. It shows:

* All logged shifts
* All weekly breakdowns

## Shift Data Tracked

Each shift can store:

* Platform (`Uber` or `Lyft`)
* Date
* Hours worked
* Earnings
* Gas cost
* Tolls cost
* Total expenses

## Tech Stack

* React 19
* Vite 8
* Tailwind CSS 4
* React Icons
* Open-Meteo API (weather)
* Google Gemini API (`@google/genai`) — AI chat assistant
* Vercel Serverless Functions — backend proxy that keeps the Gemini API key server-side

## Project Structure

```
frontend/
  api/
    assistant.js          # Serverless function: calls Gemini, keeps API key server-side
  src/
    components/
      AIWeeklyInsights.jsx
      DriverChatBot.jsx    # AI chat UI, talks to /api/assistant
      EarningsSummary.jsx
      NavBar.jsx
      RecordsOverview.jsx
      ShiftForm.jsx
      ShiftList.jsx
      WeatherCard.jsx      # Current conditions + 3-day forecast
      WeeklyBreakdown.jsx
    utils/
      analytics.js         # Client-safe shift math (no API keys/AI calls)
      formatters.js
      weather.js            # Open-Meteo fetch + forecast parsing
    App.jsx
```

## How It Works

### Weather

The app uses browser geolocation to get the user's location and calls Open-Meteo for current conditions plus a 3-day forecast, rendered on the Weather Card.

### Weekly Analytics

Weekly data is grouped by the start of the week. The app calculates:

* Earnings by day
* Hours by day
* Expenses by day
* Gas and toll totals
* Which week has the most shifts

### Rule-Based Weekly Insights

The dashboard's insights panel is generated locally (no API calls) from the user's shift history. It highlights patterns such as:

* Best earning day
* Strongest platform by hourly average
* Weekly take-home pace
* Whether gas or tolls are having a larger impact on profit

### AI Driver Copilot

A separate chat assistant, powered by Google's Gemini API, that can answer open-ended questions like "how's work today" or "how were my Uber earnings this week." It has context on:

* The driver's logged shift history
* Current month/season, used to give accurate seasonal demand guidance
* General NYC traffic bottleneck patterns

The chatbot never calls Gemini directly from the browser. It sends the user's message to a Vercel serverless function (`/api/assistant`), which holds the real Gemini API key in a server-side environment variable and returns just the reply text. This keeps the key out of the public JS bundle entirely.

## Getting Started

1. Install dependencies

```
npm install
```

2. Set up environment variables

Create a `.env` file inside `frontend/` (this file is gitignored and never committed):

```
GEMINI_API_KEY=your_key_here
```

> Note: this key intentionally has **no** `VITE_` prefix. Vite inlines any `VITE_`-prefixed variable into the client bundle, which would expose it publicly. `GEMINI_API_KEY` is only ever read server-side, inside `api/assistant.js`.

3. Start the development server

```
npm run dev
```

This runs the Vite dev server for the frontend. Note that `npm run dev` does **not** serve the `/api` serverless functions — for local testing of the AI chatbot, use the Vercel CLI instead:

```
npm install -g vercel
vercel dev
```

`vercel dev` links to your Vercel project, pulls down environment variables, and serves both the frontend and `/api/assistant` together, matching production behavior.

4. Build for production

```
npm run build
```

5. Preview the production build

```
npm run preview
```

### Linting

```
npm run lint
```

## Data Storage & Privacy

* Shift data (platform, hours, earnings, expenses) is stored entirely in the browser via `localStorage` — it never leaves the device except when included as context in a chat message sent to the AI assistant.
* Because of `localStorage`, data stays on the same browser/device, clearing browser storage will remove saved shifts, and there is no login or cloud sync.
* The Gemini API key lives only in Vercel's server-side environment variables — it is never present in the frontend bundle or committed to source control.

## Future Improvements

Possible next upgrades for the project:

* Weather saved per shift for weather-vs-earnings analysis
* Charts for weekly and monthly earnings
* Mileage tracking
* Export to CSV or PDF
* Driver account system with cloud storage
* Streaming responses from the AI assistant for a faster perceived reply

## Deployment

This project is deployed on Vercel, including both the static frontend and the `/api/assistant` serverless function.
[View Driver Hub Live](https://driver-hub-seven.vercel.app/)

## Notes

* Shift data is stored in browser `localStorage`
* AI chat requests are proxied through a Vercel serverless function so the Gemini API key is never exposed client-side
* Weather uses Open-Meteo and browser geolocation
