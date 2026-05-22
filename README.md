# Driver Hub

Driver Hub is a dedicated full-stack web application designed for rideshare drivers to track shifts, manage subcategorized expenses, and analyze clear financial analytics across multiple platforms like Uber and Lyft. The application helps drivers optimize their working schedules by providing visual breakdowns of gross revenues, net take-home pay, and operational costs.

## Core Features

* **Multi-Platform Log Management:** Dynamically input and organize shifts by date, duration, platform selection, and exact earnings.
* **Granular Expense Subcategorization:** Track operational expenses separated directly into gas costs and road toll charges inside each log card.
* **Real-time Financial Analytics:** A dashboard passport rendering automatic computations for gross revenues, total expenses, net profits, and average hourly metrics.
* **Weekly Performance Breakdown:** Dynamic structural sorting compiling log objects into readable weekly calendars tracking active day rates and trends.
* **Persistent Browser Storage:** Built-in `localStorage` integration automatically syncing shift modifications directly onto the browser to ensure zero data loss upon tab reloads.

## Tech Stack

* **Frontend Framework:** React (Vite)
* **Styling Engine:** Tailwind CSS
* **Icons:** React Icons (`react-icons/fa6`, `react-icons/io5`)
* **State Persistence:** LocalStorage API

## File Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── EarningsSummary.jsx   # Metrics panels calculating gross, net, and hourly averages
│   │   ├── NavBar.jsx            # Top panel navigation bar switching dashboard views
│   │   ├── ShiftForm.jsx         # Form component supporting granular expense inputs
│   │   ├── ShiftList.jsx         # Component rendering individual log objects and removal controls
│   │   └── WeeklyBreakdown.jsx   # Grouped summary view sorting historical logs into calendar weeks
│   ├── utils/
│   │   ├── analytics.js          # Computes weekly groupings and chronological tracking
│   │   └── formatters.js         # Standardizes timestamp outputs and decimal presentations
│   ├── App.jsx                   # Central state machine orchestrating data transformations
│   ├── App.css                   # Global layout rules and responsive overrides
│   └── main.jsx                  # Main entry point mounting the React DOM

```

## Setup and Installation

Follow these steps to run the frontend application locally on your computer:

1. **Clone the Repository:**
```bash
git clone <repository-url>
cd driver-hub-app/driver-hub-1/frontend

```


2. **Install Dependencies:**
```bash
npm install

```


3. **Launch the Development Server:**
```bash
npm run dev

```


4. **Open Your Browser:**
Navigate to the local address provided by your terminal interface (typically `http://localhost:5173`) to view the application live.

## Component Architecture Workflow

1. **Data Ingestion (`ShiftForm.jsx`):** Captures individual variables for platform types, total operating times, revenue totals, and segregated cost points.
2. **State Elevation (`App.jsx`):** Formulates single objects assigned a unique tracking timestamp before prepending the configuration into the central `shifts` array.
3. **Data Persistency (`App.jsx`):** Activates a `useEffect` hook listening to array modifications to stringify and store data inside your browser space instantly.
4. **Data Aggregation (`EarningsSummary.jsx`):** Employs standard JavaScript array methods like `.reduce()` to cleanly summarize complete monetary lists in a single loop execution.