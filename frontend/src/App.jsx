import { useEffect, useState } from 'react';
import './App.css';
import EarningsSummary from './components/EarningsSummary';
import ShiftForm from './components/ShiftForm';
import ShiftList from './components/ShiftList';
import WeeklyBreakdown from './components/WeeklyBreakdown';
import NavBar from './components/NavBar';
import WeatherCard from './components/WeatherCard';
import AIWeeklyInsights from './components/AIWeeklyInsights';
import RecordsOverview from './components/RecordsOverview';
import { getWeekWithMostShifts } from './utils/analytics';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const [shifts, setShifts] = useState(() => {
    const savedShifts = localStorage.getItem('driver-hub-data');
    return savedShifts ? JSON.parse(savedShifts) : [];
  });

  useEffect(() => {
    localStorage.setItem('driver-hub-data', JSON.stringify(shifts));
  }, [shifts]);

  const addShift = (newShift) => {
    setShifts((prevShifts) => [...prevShifts, newShift]);
  };

  const deleteShift = (id) => {
    setShifts((prevShifts) => prevShifts.filter((shift) => shift.id !== id));
  };

  const busiestWeek = getWeekWithMostShifts(shifts);

  return (
    <div className="min-h-screen bg-slate-100">
      <NavBar activePage={activePage} setActivePage={setActivePage} />

      <main className="w-full px-4 md:px-8 py-6 mx-auto">
        {activePage === 'dashboard' ? (
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            <WeatherCard />
            <EarningsSummary shifts={shifts} />
            <AIWeeklyInsights shifts={shifts} />
            <WeeklyBreakdown
              shifts={shifts}
              weekStarts={busiestWeek ? [busiestWeek] : []}
              title="Busiest Week"
              emptyMessage="No weekly shift data yet. Add a shift to see your busiest week here."
              className="space-y-4"
            />
          </div>
        ) : activePage === 'shifts' ? (
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 items-start">
            <ShiftForm onAddShift={addShift} />
            <ShiftList
              shifts={shifts}
              onDelete={deleteShift}
              limit={3}
              title="Most Recent Shifts"
              emptyMessage="No shifts logged yet. Start by adding one above!"
            />
          </div>
        ) : (
          <RecordsOverview shifts={shifts} onDelete={deleteShift} />
        )}
      </main>
    </div>
  );
}

export default App;
