// Helper function to get the start of the week (Monday)
const getStartOfWeek = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay(); 
    // This math ensures that even if you work on a Sunday, it finds the previous Monday
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
};

export const calculateWeeklyBreakdown = (shifts) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyData = {}; // Changed from weeklyDate to match your later usage

    shifts.forEach(shift => {
        const weekStarting = getStartOfWeek(shift.date);
        const dateObj = new Date(shift.date);
        const dayName = days[dateObj.getDay()];
         
        if (!weeklyData[weekStarting]) {
            weeklyData[weekStarting] = {
                weekLabel: weekStarting,
                days: {} // Make sure this is 'days' (plural)
            };
        }

        if (!weeklyData[weekStarting].days[dayName]) {
            weeklyData[weekStarting].days[dayName] = { 
                earnings: 0, // Match your UI: 'earnings' (plural)
                hours: 0, 
                expenses: 0,
                gas: 0,
                tolls: 0,
                otherExpenses: 0,
                date: shift.date 
            };
        }

        // 3. Add the data
        weeklyData[weekStarting].days[dayName].earnings += Number(shift.earnings || 0);
        weeklyData[weekStarting].days[dayName].hours += Number(shift.hours || 0);
        weeklyData[weekStarting].days[dayName].expenses += Number(shift.expenses || 0);

        if(shift.expenseDetails){
            const {amount, type} = shift.expenseDetails;
            if(type === 'Gas'){
                weeklyData[weekStarting].days[dayName].gas += Number(amount || 0);
            }else if(type === 'Tolls'){
                weeklyData[weekStarting].days[dayName].tolls += Number(amount || 0);
            }else{
                weeklyData[weekStarting].days[dayName].otherExpenses += Number(amount || 0);
            }
        }
    });


    // 4. FIX: Return 'weeklyData', not 'breakdown' (which wasn't defined)
    return weeklyData;
};