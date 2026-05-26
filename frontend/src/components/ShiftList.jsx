// we receive 'shifts' (the array) and 'onDelete' (the function) as props from app.jsx
import { formatDate } from '../utils/formatters';
import { sortShiftsByMostRecent } from '../utils/analytics';
import { FaTrashAlt } from 'react-icons/fa';

const ShiftList = ({
  shifts,
  onDelete,
  limit,
  title = 'Recent History',
  emptyMessage = 'No shifts logged yet. Start by adding one above!'
}) => {
  const sortedShifts = sortShiftsByMostRecent(shifts);
  const visibleShifts = typeof limit === 'number' ? sortedShifts.slice(0, limit) : sortedShifts;

  if (visibleShifts.length === 0) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-xl text-center">
        <p className="text-slate-500 italic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold font-sans text-slate-800 text-shadow-md">{title}</h3>

      {visibleShifts.map((shift) => {
        const totalExpenses = shift.expenses || 0;

        return (
          <div
            key={shift.id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xl text-shadow-xs hover:shadow-blue-500 shadow-blue-500/70 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-blue-300 transition-colors gap-4"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                  shift.platform === 'Uber' ? 'bg-black' : 'bg-pink-500'
                }`}
              >
                {shift.platform}
              </div>

              <div>
                <p className="text-slate-800 font-bold">{formatDate(shift.date)}</p>
                <p className="text-slate-500 text-sm">{shift.hours} hours worked</p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end w-full md:w-auto space-x-6 md:space-x-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-right">
                <p className="text-green-600 font-bold text-lg">${shift.earnings.toLocaleString()}</p>
                <p className="text-slate-400 text-xs">${(shift.earnings / shift.hours).toFixed(2)}/hr</p>
              </div>

              <div className="text-right border-l border-slate-200 pl-6 min-w-[110px]">
                <p className="text-red-500 font-bold text-base">
                  {totalExpenses > 0 ? `-$${totalExpenses.toLocaleString()}` : '$0'}
                </p>

                <div className="flex flex-col text-[11px] text-slate-400 font-medium mt-0.5">
                  {shift.expenseItems && shift.expenseItems.length > 0 ? (
                    shift.expenseItems.map((exp, index) => (
                      <span key={index} className="block">
                        {exp.type === 'Gas' ? 'Gas' : 'Tolls'} ${exp.amount.toLocaleString()}
                      </span>
                    ))
                  ) : (
                    <span>{totalExpenses > 0 ? 'Gas' : 'No Costs'}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDelete(shift.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-2"
                title="Delete Shift"
              >
                <FaTrashAlt className="text-lg " />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShiftList;
