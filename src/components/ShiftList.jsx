// we receive 'shifts' (the array) and 'onDelete' (the function) as props from app.jsx
import { formatDate } from "../utils/formatters";
const ShiftList = ({ shifts, onDelete}) => {

    // if there are no shifts, show a friendly message instead of an empty screen
    if(shifts.length === 0){
        return <p> NO shifts logged yet. Start by adding one above!</p>
    }

    return (
        <div style={{marginTop: '20px'}}>
            <h2>Recent Shifts</h2>
            {/**
             * .map() goes through every shift in our array one by one.
             * for each 'shift', it returns a block on HTML
             */}

             {shifts.map((shift) => (
                <div
                //key helps us remember which item is which
                key={shift.id}
                style={{ 
                    border: '1px solid #ddd', 
                    padding: '10px', 
                    margin: '10px 0', 
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                >
                    <div>
                        {/**displaying the specific properties we created in our ShiftForm object */}
                        <strong>{shift.platform}</strong> - {formatDate(shift.date)} <br/>
                        <span>{shift.hours} hours | ${shift.earnings} </span>
                    </div>
                    {/**we call the onDelete and pass the specific ID of this shift */}
                    <button
                    onClick={() => onDelete(shift.id)}
                    style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                    >Delete</button>
                </div>
             )
             
             )}
        </div>
    )
}
export default ShiftList;