// New logic updated with bug fixes

const EarningsSummary = ({ shifts }) => {
    // Calculate all financial totals in a single pass using .reduce()
    // acc = accumulator acts as our running scoreboard object
    // shift is the individual shift object we are looping through
    const totals = shifts.reduce((acc, shift) => {
        acc.gross += Number(shift.earnings || 0); // FIXED: Changed shift.earning to shift.earnings
        acc.hours += Number(shift.hours || 0);
        acc.expenses += Number(shift.expenses || 0); 

        //Pull separate metrics based on the logged expense category object
        if (shift.expenseItems && shift.expenseItems.length > 0) {
            shift.expenseItems.forEach(item => {
                if (item.type === 'Gas') acc.gas += item.amount;
                else if (item.type === 'Tolls') acc.tolls += item.amount;
            });
        } else {
            // Backward compatibility line
            acc.gas += Number(shift.expenses || 0);
        }
        return acc;
    }, { gross: 0, hours: 0, expenses: 0, gas:0, tolls:0}); // Initial state setup starting at zero

    // Financial calculations
    const netProfit = totals.gross - totals.expenses; // What you actually keep after cost

    // Average calculations with check to prevent NaN errors
    const avgHourlyGross = totals.hours > 0 ? (totals.gross / totals.hours).toFixed(2) : 0;
    const avgHourlyNet = totals.hours > 0 ? (netProfit / totals.hours).toFixed(2) : 0;

    // Formatting strings to add clean commas to large numbers 
    const formattedGross = totals.gross.toLocaleString();
    const formattedExpenses = totals.expenses.toLocaleString();
    const formattedNet = netProfit.toLocaleString(); // FIXED: Removed 'totals.' and corrected spelling to 'toLocaleString'

    //formatted string for subcategories
    const formattedGas = totals.gas.toLocaleString();
    const formattedTolls = totals.tolls.toLocaleString();

    return (
        // FIXED: Changed 'md:grid-col-3' to 'md:grid-cols-3'
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Gross revenue total money brought in */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 group shadow-blue-500/70 hover:shadow-blue-500 text-shadow-md transition-all text-center md:text-left">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Gross Revenue</p>
                <h2 className="text-3xl font-bold text-slate-800 mt-2">${formattedGross}</h2>
                <p className="text-xs text-blue-500 mt-2 font-semibold">${avgHourlyGross}/hr gross</p>
            </div>

            {/* Total losses/expenses (Gas, maintenance, tolls) */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 group shadow-red-500/70 hover:shadow-red-500 text-shadow-md transition-all text-center md:text-left">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Expenses</p>
                <h2 className="text-3xl font-bold text-red-600 mt-2">-${formattedExpenses}</h2>

                {/* Visual breakdowns sitting underneath the main number */}
                <div className="flex justify-center md:justify-start space-x-4 mt-2 text-xs font-medium text-slate-500 border-t border-slate-100 pt-2">
                    <span className="flex items-center">Gas: <strong className="text-slate-700 ml-1">${formattedGas}</strong></span>
                    <span className="flex items-center">Tolls: <strong className="text-slate-700 ml-1">${formattedTolls}</strong></span>
                </div>
            </div>

            {/* Net profit (The actual Take home pocket money) */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-100 bg-green-50/30 group hover:bg-green-50 hover:shadow-green-200 shadow-green-100 hover:text-shadow-md transition-all text-center md:text-left">
                <p className="text-sm font-medium text-green-700 uppercase tracking-wider">Net Profit (Take Home)</p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">${formattedNet}</h2>
                <p className="text-xs text-green-700 mt-2 font-bold">${avgHourlyNet}/hr net</p>
            </div>
        </div>
    );
};

export default EarningsSummary;



