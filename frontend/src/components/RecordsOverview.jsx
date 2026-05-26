import ShiftList from './ShiftList';
import WeeklyBreakdown from './WeeklyBreakdown';

const RecordsOverview = ({ shifts, onDelete }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 items-start">
      {/* Left side shows the full shift history with delete controls. */}
      <ShiftList
        shifts={shifts}
        onDelete={onDelete}
        title="All Logged Shifts"
        emptyMessage="No shifts logged yet. Add one from the Shift Log page to build your history."
      />

      {/* Right side shows every available week instead of only the busiest one. */}
      <WeeklyBreakdown
        shifts={shifts}
        title="All Logged Weeks"
        emptyMessage="No weekly breakdown yet. Start by logging a shift."
        className="space-y-4"
      />
    </div>
  );
};

export default RecordsOverview;
