// we receive 'shifts' (the array) and 'onDelete' (the function) as props from app.jsx
import { formatDate } from "../utils/formatters";
import { FaTrashAlt } from "react-icons/fa";
const ShiftList = ({ shifts, onDelete}) => {

    // if there are no shifts, show a friendly message instead of an empty screen
    if(shifts.length === 0){
        return <p> NO shifts logged yet. Start by adding one above!</p>
    }

    return (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Recent History</h3>
          
          {shifts.length === 0 ? (
            <p className="text-slate-500 italic">No shifts logged yet...</p>
          ) : (
            shifts.map((shift) => (
              <div key={shift.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-blue-300 transition-colors">
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
    
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-green-600 font-bold text-lg">${shift.earnings}</p>
                    <p className="text-slate-400 text-xs">${(shift.earnings / shift.hours).toFixed(2)}/hr</p>
                  </div>
                  
                  <button 
                    onClick={() => onDelete(shift.id)}
                    className="p-2 text-xl text-black-300 hover:text-red-500 transition-colors"
                    title="Delete Shift"
                  ><FaTrashAlt />
                    
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      );
}
export default ShiftList;