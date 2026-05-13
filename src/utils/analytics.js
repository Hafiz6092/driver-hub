//transforming an array of shifts into a breakdown of earnings per day of the week.
export const calculateWeeklyBreakdown = (shifts) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    //initializing an object with $0 for every day
    const breakdown = days.reduce((acc, day)=>{
        acc[day] = {earnings: 0, hours: 0, count: 0};
        return acc;
    }, {});

    //loop through shifts and "bucket them into the correct day
    shifts.forEach(shift =>{
        const dateObj = new Date(shift.date);
        const dayName = days[dateObj.getDay()];
         
        if(breakdown[dayName]){
            breakdown[dayName].earnings += Number(shift.earnings || 0);
            breakdown[dayName].hours += Number(shift.hours || 0);
            breakdown[dayName].count += 1; //tracking how many shifts happened that day
            breakdown[dayName].date = shift.date;
        }
    });
    return breakdown;
}