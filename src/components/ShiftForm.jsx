import {useState} from 'react';

const ShiftForm = ({onAddShift}) => {
    //create local state variable for our three inputs
    //'usState' gives us the variable ane the function to change it
    const [platform, setPlatform] = useState('Uber');
    const [hours, setHours] = useState('');
    const [earnings, setEarnings] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [expenses, setExpenses] = useState('');
    const [expenseType, setExpenseType] = useState('Gas');
    const [error, setError] = useState('');
    

    //this function runs when the user clicks the "add shift" button
    const handleSubmit = (e) => {
        //prevents the browser from reloading the page(default HTML form behavior)
        e.preventDefault();

        //simple check: is hours or earnings are missing, show an alert and stop
        if(!hours || !earnings){
            setError('Please fill out all details before logging your shift.')
            return
        }

        //clear any previous error if the input if now valid
        setError('');

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
            expenseDetails:{
                amount: Number(expenses || 0),
                type: expenseType
            },
            expenses: Number(expenses || 0),
            date: date

        };
        console.log("Adding Shift with categorized expenses:", newShift)
        //call the function passed from app.jsx to "lift" the data back up to parent
        onAddShift(newShift);

        //reset the inputs to empty strings after the form is submitted
        setHours('');
        setEarnings('');
        setExpenses('');
        setExpenseType('');

    };
    //the 'return' block is what actually renders on the screen/shows on the screen
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 w-full max-w-5xl mx-auto">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Log a New Shift</h3>
          
          {/* Container: 1 column on mobile, 12 fractional columns on desktop for ultimate sizing control */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* 1. Platform Selector (Takes up 2 columns out of 12) */}
            <div className="flex flex-col space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</label>
              <select 
                value={platform} 
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700 h-11"
              >
                <option value="Uber">Uber</option>
                <option value="Lyft">Lyft</option>
              </select>
            </div>
      
            {/* 2. Date Input (Takes up 2 columns out of 12) */}
            <div className="flex flex-col space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 h-11"
              />
            </div>
      
            {/* 3. Hours Input (Takes up 2 columns out of 12) */}
            <div className="flex flex-col space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hours</label>
              <input 
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g. 8"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-11"
              />
            </div>
      
            {/* 4. Earnings Input (Takes up 2 columns out of 12) */}
            <div className="flex flex-col space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Earnings ($)</label>
              <input 
                type="number"
                value={earnings}
                onChange={(e) => setEarnings(e.target.value)}
                placeholder="e.g. 250"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-11"
              />
            </div>
    
            {/* 5. Expense Numeric Input (Takes up 2 columns out of 12) */}
            <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-red-500 uppercase tracking-wider">Expense ($)</label>
                <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-red-400 outline-none h-11"
                />
            </div>
    
            {/* 6. Expense Dropdown Category Type (Takes up 2 columns out of 12) */}
            <div className="flex flex-col space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-red-500 uppercase tracking-wider">Type</label>
              <select 
                value={expenseType} 
                onChange={(e) => setExpenseType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-red-400 outline-none font-medium text-slate-700 h-11"
              >
                <option value="Gas"> Gas</option>
                <option value="Tolls"> Tolls</option>
                <option value="Other"> Other</option>
              </select>
            </div>

            {error &&(
                <div className="col-span-1 md:col-span-12 mt-2 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-700 font-medium text-sm animate-fade-in">
                    <span></span>
                    <span>{error}</span>
                </div>
            )}
      
            {/* Submit Button - Spans full width across all 12 grid blocks at the bottom */}
            <button 
              type="submit" 
              className="col-span-1 md:col-span-12 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4 text-sm tracking-wide shadow-sm"
            >
              Add Shift to Log
            </button>
          </div>
        </form>
    );
    };
export default ShiftForm;