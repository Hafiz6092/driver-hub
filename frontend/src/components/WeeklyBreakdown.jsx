import { calculateWeeklyBreakdown } from "../utils/analytics";
import { formatDate } from "../utils/formatters";

const WeeklyBreakdown = ({shifts}) => {  
    const weeklyData = calculateWeeklyBreakdown(shifts);
    const weekKeys = Object.keys(weeklyData).sort().reverse(); //show newest weeks first

    return(
        <div className="mt-8 space-y-6">
      {weekKeys.map((weekStart) => (
        <div key={weekStart} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          {/* Week Header */}
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
            Week of {formatDate(weekStart)}
          </h3>

          <div className="space-y-3">
            {Object.keys(weeklyData[weekStart].days).map((dayName) => {
              const { earnings, hours, date } = weeklyData[weekStart].days[dayName];
              const hourlyRate = hours > 0 ? (earnings / hours).toFixed(2) : 0;

              return (
                <div key={date} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <span className="font-semibold text-slate-700">
                      {dayName} <span className="text-xs text-slate-400 font-normal">- {formatDate(date)}</span>
                    </span>
                    <p className="text-xs text-slate-500">{hours} hrs</p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-bold">${earnings}</span>
                    <p className="text-xs text-blue-500">${hourlyRate}/hr</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
    );
};

export default WeeklyBreakdown;