import { useState } from 'react';

const ShiftForm = ({ onAddShift }) => {
    // Create local state variables for our inputs
    const [platform, setPlatform] = useState('Uber');
    const [hours, setHours] = useState('');
    const [earnings, setEarnings] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [gasCost, setGasCost] = useState('');
    const [tollsCost, setTollsCost] = useState(''); 
    const [error, setError] = useState('');
    

    // This function runs when the user clicks the "Add Shift" button
    const handleSubmit = (e) => {
        // Prevents the browser from reloading the page
        e.preventDefault();

        // Simple check: if hours or earnings are missing, set error text and stop
        if (!hours || !earnings) {
            setError('Please fill out all details before logging your shift.');
            return;
        }

        // Clear any previous error if the input is now valid
        setError('');

        // Calculating the total sum of all expenses combined
        const totalExpensesSum = Number(gasCost || 0) + Number(tollsCost || 0);

        // Build array of separate expenses objects
        const expenseList = [];
        if (Number(gasCost) > 0) expenseList.push({ amount: Number(gasCost), type: 'Gas' });
        if (Number(tollsCost) > 0) expenseList.push({ amount: Number(tollsCost), type: 'Tolls' });
        
        // Create a new object using our current state variables
        const newShift = {
            id: Date.now(), // Generates a unique ID
            platform,
            hours: Number(hours),
            earnings: Number(earnings),
            expenseItems: expenseList,
            expenses: totalExpensesSum,
            date: date
        };
        
        console.log("Adding Shift with multiple expenses:", newShift);
        // Lift the data back up to the parent component
        onAddShift(newShift);

        // Reset the inputs to empty strings after the form is submitted cleanly
        setHours('');
        setEarnings('');
        setGasCost('');
        setTollsCost('');
    };

    // FIXED: Corrected 'rreturn' typo down to 'return'
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 w-full max-w-5xl mx-auto">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Log a New Shift</h3>
          
          {/* 5 columns on desktop grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            
            {/* Platform */}
            <div className="flex flex-col space-y-1">
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
      
            {/* Date */}
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 h-11"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-11"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-11"
              />
            </div>

            {/* Combined Expense Row: Gas and Tolls side-by-side inside one grid column block */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-red-500 uppercase tracking-wider">⛽ Gas ($)</label>
                    <input
                        type="number"
                        value={gasCost} // FIXED: Added missing local state binding value prop
                        onChange={(e) => setGasCost(e.target.value)}
                        placeholder="40"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-red-400 outline-none h-11 text-sm"
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-red-500 uppercase tracking-wider">🛣️ Tolls ($)</label>
                    <input
                        type="number"
                        value={tollsCost} // FIXED: Added missing local state binding value prop
                        onChange={(e) => setTollsCost(e.target.value)}
                        placeholder="20"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-red-400 outline-none h-11 text-sm"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="col-span-1 md:col-span-5 mt-2 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-700 font-medium text-sm">
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}
      
            {/* Submit Button */}
            <button 
              type="submit" 
              className="col-span-1 md:col-span-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2 text-sm tracking-wide shadow-sm"
            >
              Add Shift to Log
            </button>
          </div>
        </form>
    );
};

export default ShiftForm;