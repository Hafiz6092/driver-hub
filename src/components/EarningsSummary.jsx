// New logic updated with bug fixes

const EarningsSummary = ({ shifts }) => {
    // Calculate all financial totals in a single pass using .reduce()
    // acc = accumulator acts as our running scoreboard object
    // shift is the individual shift object we are looping through
    const totals = shifts.reduce((acc, shift) => {
        acc.gross += Number(shift.earnings || 0); // FIXED: Changed shift.earning to shift.earnings
        acc.hours += Number(shift.hours || 0);
        acc.expenses += Number(shift.expenses || 0); 
        return acc;
    }, { gross: 0, hours: 0, expenses: 0 }); // Initial state setup starting at zero

    // Financial calculations
    const netProfit = totals.gross - totals.expenses; // What you actually keep after cost

    // Average calculations with check to prevent NaN errors
    const avgHourlyGross = totals.hours > 0 ? (totals.gross / totals.hours).toFixed(2) : 0;
    const avgHourlyNet = totals.hours > 0 ? (netProfit / totals.hours).toFixed(2) : 0;

    // Formatting strings to add clean commas to large numbers 
    const formattedGross = totals.gross.toLocaleString();
    const formattedExpenses = totals.expenses.toLocaleString();
    const formattedNet = netProfit.toLocaleString(); // FIXED: Removed 'totals.' and corrected spelling to 'toLocaleString'

    return (
        // FIXED: Changed 'md:grid-col-3' to 'md:grid-cols-3'
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Gross revenue total money brought in */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-500 transition-all text-center md:text-left">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Gross Revenue</p>
                <h2 className="text-3xl font-bold text-slate-800 mt-2">${formattedGross}</h2>
                <p className="text-xs text-blue-500 mt-2 font-semibold">${avgHourlyGross}/hr gross</p>
            </div>

            {/* Total losses/expenses (Gas, maintenance, tolls) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-red-500 transition-all text-center md:text-left">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Expenses</p>
                <h2 className="text-3xl font-bold text-red-600 mt-2">-${formattedExpenses}</h2>
                <p className="text-xs text-slate-400 mt-2 italic">Gas, Tolls, Fees</p>
            </div>

            {/* Net profit (The actual Take home pocket money) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 bg-green-50/30 group hover:bg-green-50 transition-all text-center md:text-left">
                <p className="text-sm font-medium text-green-700 uppercase tracking-wider">Net Profit (Take Home)</p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">${formattedNet}</h2>
                <p className="text-xs text-green-700 mt-2 font-bold">${avgHourlyNet}/hr net</p>
            </div>
        </div>
    );
};

export default EarningsSummary;




















//OLD LOGIC
// const EarningsSummary = ({shifts}) => {
//     /**
//      * calculate total earnings
//      * .reduce() takes a list and reduces it to a single number
//      * (acc) is the accumulator the running total 
//      * shift is the current item we are looking at
//      */
//     // const totalEarnings = shifts.reduce((acc, shift) =>{ 
//     //     return acc + Number(shift.earnings || 0);
//     // }, 0);
//     // //calculate total hours
//     // const totalHours = shifts.reduce((acc, shift) =>{
//     //     return acc + Number(shift.hours || 0);
//     // }, 0);



//     //cwe only run toLocalString() is totalEarning is definitely a number
//     const formattedEarnings = typeof totalEarnings === 'number' ?
//     totalEarnings.toLocaleString() : '0';
//     //calculate hourly rate 
//     //we check if totalHours is greater than 0 to avoid 'Divided by zero' errors NaN

//     const hourlyRate = totalHours > 0 ? (totalEarnings/totalHours).toFixed(2) : 0;
//     return (
//         <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-around', 
//             backgroundColor: '#f4f4f9', 
//             padding: '20px', 
//             borderRadius: '12px',
//             marginBottom: '20px',
//             textAlign: 'center'
//           }}>
//             <div>
//                 <h4>Total Earned</h4>
//                 {/**we use .toLocalString() to add commas to large numbers */}
//                 <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
//                     ${formattedEarnings}
//                 </p>
//             </div>

//             <div>
//                 <h4>Total Hours</h4>
//                 <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
//                     {totalHours}h
//                 </p>
//             </div>
//             <div>
//                 <h4>Avg. Hourly</h4>
//                 <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
//                     ${hourlyRate}/hr
//                 </p>
//             </div>

//         </div>
//     )
// }
// export default EarningsSummary;
