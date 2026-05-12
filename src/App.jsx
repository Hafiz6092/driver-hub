import { useEffect } from 'react';
import { useState } from 'react'
import './App.css'
import EarningsSummary from './components/EarningsSummary';
import ShiftForm from './components/ShiftForm';
import ShiftList from './components/ShiftList';

function App() {
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <header>
        <h1 className="text-3xl font'bold underline text-blue-600">Driver Hub</h1>
        <p>Track your rideshare Earnings and productivity.</p>
      </header>
      <main>
        <EarningsSummary shifts={shifts}/>
        <ShiftForm onAddShift={addShift}/>
        <ShiftList shifts={shifts} onDelete={deleteShift}/>
      </main>
    </div>
  )
}

export default App
