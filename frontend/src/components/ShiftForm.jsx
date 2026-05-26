import { useState } from 'react';

const ShiftForm = ({ onAddShift }) => {
  // Each input gets its own piece of state so the form stays controlled.
  const [platform, setPlatform] = useState('Uber');
  const [hours, setHours] = useState('');
  const [earnings, setEarnings] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [gasCost, setGasCost] = useState('');
  const [tollsCost, setTollsCost] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    // Stop the browser from doing a full page refresh on submit.
    e.preventDefault();

    // Basic validation for the minimum fields we need.
    if (!hours || !earnings) {
      setError('Please fill out all details before logging your shift.');
      return;
    }

    setError('');

    // Store one total expense number for quick math in summaries.
    const totalExpensesSum = Number(gasCost || 0) + Number(tollsCost || 0);

    // Also keep the expense items split out so other screens can show details.
    const expenseList = [];
    if (Number(gasCost) > 0) expenseList.push({ amount: Number(gasCost), type: 'Gas' });
    if (Number(tollsCost) > 0) expenseList.push({ amount: Number(tollsCost), type: 'Tolls' });

    // This shape is what the rest of the app expects for one shift.
    const newShift = {
      id: Date.now(),
      platform,
      hours: Number(hours),
      earnings: Number(earnings),
      expenseItems: expenseList,
      expenses: totalExpensesSum,
      date
    };

    // Send the finished shift object up to App so it can be saved.
    onAddShift(newShift);

    // Clear the numeric inputs so the next shift starts fresh.
    setHours('');
    setEarnings('');
    setGasCost('');
    setTollsCost('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl hover:shadow-blue-500 shadow-blue-500/70 text-shadow-sm border border-slate-200 mb-8 w-full max-w-5xl mx-auto">
      <h3 className="text-lg font-bold font-sans text-slate-800 mb-4">Log a New Shift</h3>

      {/* The form uses a 5-column layout on desktop so all inputs stay on one line. */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 h-11"
          />
        </div>

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

        {/* Gas and tolls live together because they are both expense inputs. */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-red-500 uppercase tracking-wider">⛽ Gas ($)</label>
            <input
              type="number"
              value={gasCost}
              onChange={(e) => setGasCost(e.target.value)}
              placeholder="40"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-red-400 outline-none h-11 text-sm"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-red-500 uppercase tracking-wider">🛣️ Tolls ($)</label>
            <input
              type="number"
              value={tollsCost}
              onChange={(e) => setTollsCost(e.target.value)}
              placeholder="20"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-red-400 outline-none h-11 text-sm"
            />
          </div>
        </div>

        {/* Validation message only appears after a bad submit. */}
        {error && (
          <div className="col-span-1 md:col-span-5 mt-2 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-700 font-medium text-sm">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

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
