import {useState} from 'react';

const ShiftForm = ({onAddShift}) => {
    //create local state variable for our three inputs
    //'usState' gives us the variable ane the function to change it
    const [platform, setPlatform] = useState('Uber');
    const [hours, setHours] = useState(' ');
    const [earnings, setEarnings] = useState(' ');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [expenses, setExpenses] = useState(' ');
    

    //this function runs when the user clicks the "add shift" button
    const handleSubmit = (e) => {
        //prevents the browser from reloading the page(default HTML form behavior)
        e.preventDefault();

        //simple check: is hours or earnings are missing, show an alert and stop
        if(!hours || !earnings) return alert("Please fill in all fields");

        //we create a new object using our current state variables
        const newShift = {
           //date.now generates a unique number based on current time
            id: Date.now(),
            platform,
            //we convert strings to numbers because input fields return text by default
            hours: Number(hours),
            earnings: Number(earnings),
            //auto generate today's date;
            //date: new Date().toLocaleDateString()

            date: date

        };
        console.log("Adding Shift:", newShift)
        //call the function passed from app.jsx to "lift" the data back up to parent
        onAddShift(newShift);

        //reset the inputs to empty strings after the form is submitted
        setHours(' ');
        setEarnings(' ');

    };
    //the 'return' block is what actually renders on the screen/shows on the screen
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Log a New Shift</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Platform */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</label>
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Uber">Uber</option>
                <option value="Lyft">Lyft</option>
              </select>
            </div>
      
            {/* Date */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
      
            {/* Hours */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hours</label>
              <input 
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g. 8"
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
      
            {/* Earnings */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Earnings ($)</label>
              <input 
                type="number"
                value={earnings}
                onChange={(e) => setEarnings(e.target.value)}
                placeholder="e.g. 250"
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-red-500 uppercase tracking-wider"> Gas/Expenses ($)</label>
                <input
                type = "number"
                value={expenses}
                onChange = {(e) => setExpenses(e.target.value)}
                placeholder = "e.g. 40"
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-red-400 outline-none"
                />

            </div>
      
            {/* Submit Button - Spans full width on small screens */}
            <button 
              type="submit" 
              className="md:col-span-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-2"
            >
              Add Shift to Log
            </button>
          </div>
        </form>
      );
    };
export default ShiftForm;