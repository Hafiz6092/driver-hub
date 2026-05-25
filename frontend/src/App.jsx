import { useEffect, useState } from 'react';
import './App.css';
import EarningsSummary from './components/EarningsSummary';
import ShiftForm from './components/ShiftForm';
import ShiftList from './components/ShiftList';
import WeeklyBreakdown from './components/WeeklyBreakdown';
import NavBar from './components/NavBar';
import WeatherCard from './components/WeatherCard';
import AIWeeklyInsights from './components/AIWeeklyInsights';

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

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar activePage={activePage} setActivePage={setActivePage} />

      <main className="max-w-4xl mx-auto p-4">
        {activePage === 'dashboard' ? (
          <>
            <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-stretch">
              <WeatherCard />
              <EarningsSummary shifts={shifts} />
            </section>
            <AIWeeklyInsights shifts={shifts} />
            <WeeklyBreakdown shifts={shifts} />
          </>
        ) : (
          <>
            <ShiftForm onAddShift={addShift} />
            <ShiftList shifts={shifts} onDelete={deleteShift} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
