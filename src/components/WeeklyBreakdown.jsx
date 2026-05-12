import { calculateWeeklyBreakdown } from "../utils/analytics";

const WeeklyBreakdown = ({shifts}) => {  
    const stats = calculateWeeklyBreakdown(shifts);
    const days = Object.keys(stats)

    return(
        <div className="text-lg font-bold text-slate-800 mb-4">
            <h3 className="space-y-3">Earning by day</h3>
            <div className="space-y-3">
                {days.map((day)=>{
                //if a day has no earnings, we don't render anything for it
                const {earnings, hours} = stats[day];
                const hourlyRate = hours > 0 ? (earnings / hours).toFixed(2) : 0;

                if(earnings === 0) return null;

                return(
                    <div key={day} className = "flex justify-between items-center p-3 bg-slate-50 rounded-lg" >
                        
                        {/*left side: day and hours info */}
                        <div>
                            <span className="font-semibold text-slate-700">{day}</span>
                            <p className="text-xs text-slate-500">{hours} total hours</p>
                        </div>

                        {/**right side: money and performance info */}
                        <div>
                            <span className="text-green-600 font-bold">${earnings}</span>
                            <p className="text-xs text-blue-500">${hourlyRate}/hr avg</p>
                        </div>
                    </div>

                );
                })};
            </div>
        </div>
    );
};

export default WeeklyBreakdown;