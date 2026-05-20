// we receive 'shifts' (the array) and 'onDelete' (the function) as props from app.jsx
import { formatDate } from "../utils/formatters";
import { FaTrashAlt } from "react-icons/fa";
const ShiftList = ({ shifts, onDelete}) => {

    // if there are no shifts, show a friendly message instead of an empty screen
    if(shifts.length === 0){
        return (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-xl text-center">
                <p className="text-slate-500 italic">No shifts logged yet. Start by adding one above! </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Recent History</h3>
          
          {shifts.map((shift) => {
              // Extract values safely, using fallback direct variables for older data compatibility
              const expenseAmount = shift.expenseDetails ? shift.expenseDetails.amount : (shift.expenses || 0);
              const expenseCategory = shift.expenseDetails ? shift.expenseDetails.type : 'Gas';

              return (
                <div key={shift.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center hover:border-blue-300 transition-colors gap-4">
                  
                  {/* Left Side: Badge and Metadata */}
                  <div className="flex items-center space-x-4">
                    {/* Platform Badge */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                      shift.platform === 'Uber' ? 'bg-black' : 'bg-pink-500'
                    }`}>
                      {shift.platform}
                    </div>
                    
                    <div>
                      <p className="text-slate-800 font-bold">{formatDate(shift.date)}</p>
                      <p className="text-slate-500 text-sm">{shift.hours} hours worked</p>
                    </div>
                  </div>
      
                  {/* Right Side: Financial Readouts and Actions */}
                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-6 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                    
                    {/* Earnings Readout */}
                    <div className="text-right">
                      <p className="text-green-600 font-bold text-lg">${shift.earnings.toLocaleString()}</p>
                      <p className="text-slate-400 text-xs">${(shift.earnings / shift.hours).toFixed(2)}/hr</p>
                    </div>

                    {/* NEW: Explicitly formatted Categorized Expense Column */}
                    <div className="text-right border-l border-slate-200 pl-6">
                      <p className="text-red-500 font-semibold text-base">
                        {expenseAmount > 0 ? `-$${expenseAmount.toLocaleString()}` : '$0'}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {expenseAmount > 0 ? `${expenseCategory === 'Gas' ? '⛽' : '🛣️'} ${expenseCategory}` : 'No Costs'}
                      </p>
                    </div>
                    
                    {/* Trash Container Button */}
                    <button 
                      onClick={() => onDelete(shift.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-2"
                      title="Delete Shift"
                    >
                      <FaTrashAlt className="text-lg" />
                    </button>
                  </div>

                </div>
              );
          })}
        </div>
    );
}
export default ShiftList;