
import { useEffect } from 'react';
import { useState } from 'react'
import './App.css'
import EarningsSummary from './components/EarningsSummary';
import ShiftForm from './components/ShiftForm';
import ShiftList from './components/ShiftList';
import WeeklyBreakdown from './components/WeeklyBreakdown';
import NavBar from './components/NavBar';
function App() {
  const [activePage, setActivePage] = useState('dashboard');
  //initialize state
  //we try to get data from localStorage first, if its empty we start with an empty array
  const [shifts, setShifts] = useState(()=>{
    const savedShifts = localStorage.getItem('driver-hub-data');
    return savedShifts ? JSON.parse(savedShifts) : [];

  });
  //the auto-save feature
  //useEffect run this code every time the 'shifts' array changes
  useEffect(() =>{
    //we convert the array to a string because localStorage can only store text
    localStorage.setItem('driver-hub-data', JSON.stringify(shifts));
  }, [shifts]); //dependency array the trigger

  //adding new shifts
  const addShift = (newShift) => {
    //creating new array with the old data + new shift
    setShifts((prevShifts) => [...prevShifts, newShift])
  }

  //deleting shift
  const deleteShift = (id) => {
    //.filter() creates a new array that excludes the item with the matching id
    setShifts((prevShifts) => prevShifts.filter((shifts) => shifts.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-50">
     <NavBar activePage={activePage} setActivePage={setActivePage}/>

     <main className="max-w-4xl mx-auto p-4">
      {activePage === 'dashboard' ? (
        <>
        <EarningsSummary shifts={shifts}/>
        <WeeklyBreakdown shifts={shifts}/>
        </>
      ) : (
        <>
        <ShiftForm onAddShift={addShift} />
        <ShiftList shifts ={shifts} onDelete={deleteShift}/>
        </>

      )
    }

     </main>
    </div>
  )
}

export default App
