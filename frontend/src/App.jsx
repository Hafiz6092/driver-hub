import { useEffect, useState } from 'react';
import './App.css';
import EarningsSummary from './components/EarningsSummary';
import ShiftForm from './components/ShiftForm';
import ShiftList from './components/ShiftList';
import WeeklyBreakdown from './components/WeeklyBreakdown';
import NavBar from './components/NavBar';
import WeatherCard from './components/WeatherCard';
import DriverChatBot from './components/DriverChatBot';
import RecordsOverview from './components/RecordsOverview';
import { getWeekWithMostShifts } from './utils/analytics';

function App() {
  // activePage decides which screen the user is looking at.
  // We swap views manually instead of using a router.
  const [activePage, setActivePage] = useState('dashboard');

  // shifts is the main source of truth for the whole app.
  // Every summary, insight, and breakdown is built from this array.
  const [shifts, setShifts] = useState(() => {
    // useState gets a function here so localStorage is only read once
    // on the first render instead of every time the component updates.
    const savedShifts = localStorage.getItem('driver-hub-data');
    return savedShifts ? JSON.parse(savedShifts) : [];
  });

  // Any time shifts changes, save the latest version back to localStorage.
  // That gives the app persistence without needing a backend.
  useEffect(() => {
    localStorage.setItem('driver-hub-data', JSON.stringify(shifts));
  }, [shifts]);

  // Add a newly created shift to the end of the existing array.
  const addShift = (newShift) => {
    setShifts((prevShifts) => [...prevShifts, newShift]);
  };

  // Remove one shift by id.
  // filter returns a new array without mutating the old one.
  const deleteShift = (id) => {
    setShifts((prevShifts) => prevShifts.filter((shift) => shift.id !== id));
  };

  // The dashboard only shows one weekly card now, so we precompute
  // which week has the most logged shifts.
  const busiestWeek = getWeekWithMostShifts(shifts);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* The navbar gets the current page and the setter so it can switch views. */}
      <NavBar activePage={activePage} setActivePage={setActivePage} />

      <main className="w-full px-4 md:px-8 py-6 mx-auto">
        {/* Dashboard view */}
        {activePage === 'dashboard' ? (
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Top-left: live weather snapshot */}
            <WeatherCard />

            {/* Top-right: overall earnings totals */}
            <EarningsSummary shifts={shifts} />

            {/* Bottom-left: Interactive Gemini chatbot assistant */}
            <DriverChatBot shifts={shifts} />

            {/* Bottom-right: only show the single busiest week instead of all weeks */}
            <WeeklyBreakdown
              shifts={shifts}
              weekStarts={busiestWeek ? [busiestWeek] : []}
              title="Busiest Week"
              emptyMessage="No weekly shift data yet. Add a shift to see your busiest week here."
              className="space-y-4"
            />
          </div>
        ) : activePage === 'shifts' ? (
          /* Shift Log view */
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 items-start">
            {/* Left side: form for creating a new shift */}
            <ShiftForm onAddShift={addShift} />

            {/* Right side: only the latest 3 shifts for a quick preview */}
            <ShiftList
              shifts={shifts}
              onDelete={deleteShift}
              limit={3}
              title="Most Recent Shifts"
              emptyMessage="No shifts logged yet. Start by adding one above!"
            />
          </div>
        ) : (
          /* Records view: full archive page for all shifts and all weeks */
          <RecordsOverview shifts={shifts} onDelete={deleteShift} />
        )}
      </main>
    </div>
  );
}

export default App;