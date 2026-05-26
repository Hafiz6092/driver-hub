const EarningsSummary = ({ shifts }) => {
  // Reduce all shifts into one totals object so we only loop once.
  // That keeps the component simple and avoids recalculating each card separately.
  const totals = shifts.reduce(
    (acc, shift) => {
      acc.gross += Number(shift.earnings || 0);
      acc.hours += Number(shift.hours || 0);
      acc.expenses += Number(shift.expenses || 0);

      // Newer shifts store expenses as individual items.
      // We break those back out so gas and tolls can be shown separately.
      if (shift.expenseItems && shift.expenseItems.length > 0) {
        shift.expenseItems.forEach((item) => {
          if (item.type === 'Gas') acc.gas += item.amount;
          else if (item.type === 'Tolls') acc.tolls += item.amount;
        });
      } else {
        // Older saved shifts only had a single expenses number.
        // Treat it as gas so those entries still appear in the UI.
        acc.gas += Number(shift.expenses || 0);
      }

      return acc;
    },
    { gross: 0, hours: 0, expenses: 0, gas: 0, tolls: 0 }
  );

  // Net profit is whatever is left after expenses.
  const netProfit = totals.gross - totals.expenses;

  // Guard the hourly math so we never divide by zero.
  const avgHourlyGross = totals.hours > 0 ? (totals.gross / totals.hours).toFixed(2) : 0;
  const avgHourlyNet = totals.hours > 0 ? (netProfit / totals.hours).toFixed(2) : 0;

  // Convert large numbers into a friendlier string for display.
  const formattedGross = totals.gross.toLocaleString();
  const formattedExpenses = totals.expenses.toLocaleString();
  const formattedNet = netProfit.toLocaleString();
  const formattedGas = totals.gas.toLocaleString();
  const formattedTolls = totals.tolls.toLocaleString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1: top-line revenue before any costs are removed */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 group shadow-blue-500/70 hover:shadow-blue-500 text-shadow-md transition-all text-center md:text-left">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Gross Revenue</p>
        <h2 className="text-3xl font-bold text-slate-800 mt-2">${formattedGross}</h2>
        <p className="text-xs text-blue-500 mt-2 font-semibold">${avgHourlyGross}/hr gross</p>
      </div>

      {/* Card 2: all logged costs, with gas/tolls shown underneath */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 group shadow-red-500/70 hover:shadow-red-500 text-shadow-md transition-all text-center md:text-left">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Expenses</p>
        <h2 className="text-3xl font-bold text-red-600 mt-2">-${formattedExpenses}</h2>

        <div className="flex justify-center md:justify-start space-x-4 mt-2 text-xs font-medium text-slate-500 border-t border-slate-100 pt-2">
          <span className="flex items-center">
            Gas: <strong className="text-slate-700 ml-1">${formattedGas}</strong>
          </span>
          <span className="flex items-center">
            Tolls: <strong className="text-slate-700 ml-1">${formattedTolls}</strong>
          </span>
        </div>
      </div>

      {/* Card 3: actual take-home money after costs */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-100 bg-green-50/30 group hover:bg-green-50 hover:shadow-green-200 shadow-green-100 hover:text-shadow-md transition-all text-center md:text-left">
        <p className="text-sm font-medium text-green-700 uppercase tracking-wider">Net Profit (Take Home)</p>
        <h2 className="text-3xl font-bold text-green-600 mt-2">${formattedNet}</h2>
        <p className="text-xs text-green-700 mt-2 font-bold">${avgHourlyNet}/hr net</p>
      </div>
    </div>
  );
};

export default EarningsSummary;
