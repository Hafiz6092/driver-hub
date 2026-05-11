import {useState} from 'react';

const ShiftForm = ({onAddShift}) => {
    //create local state variable for our three inputs
    //'usState' gives us the variable ane the function to change it
    const [platform, setPlatform] = useState('Uber');
    const [hours, setHours] = useState(' ');
    const [earnings, setEarnings] = useState(' ');

    //this function runs when the user clicks the "add shift" button
    const handleSubmit = (e) => {
        //prevents the browser from reloading the page(default HTML form behavior)
        e.preventDefault();

        //simple check: is hours or earnings are missing, show an alert and stop
        if(!hours || !earnings) return alert("Please fill in all fields");

        //we create a new object using our current state variables
        const newShift = {
           //date.now generates a unique number based on current time
            id: Date.now(),
            platform,
            //we convert strings to numbers because input fields return text by default
            hours: Number(hours),
            earnings: Number(earnings),
            //auto generate today's date;
            date: new Date().toLocaleDateString()

        };
        console.log("Adding Shift:", newShift)
        //call the function passed from app.jsx to "lift" the data back up to parent
        onAddShift(newShift);

        //reset the inputs to empty strings after the form is submitted
        setHours(' ');
        setEarnings(' ');

    };
    //the 'return' block is what actually renders on the screen/shows on the screen
    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>Log a New Shift</h3>

            <div>
                <label>PLatform: </label>
                {/* value connects the state to the UI; on change updates when the user types*/}
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    <option value="Uber"> Uber</option>
                    <option value="Lyft"> Lyft</option>
                </select>
            </div>

            <div>
                <label>Hours Worked: </label>
                {/**e.target.value is the text the user just typed into the box */}
                <input 
                type = "number"
                value = {hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder= "e.g. 8"
                />
            </div>
            <div>
                <label>Total Earnings: </label>
                <input
                type="number"
                value={earnings}
                onChange={(e) => setEarnings(e.target.value)}
                placeholder = "e.g. 250"
                />
            </div>
            {/**Button click triggers the 'onSubmit' event in the form tag above */}
            <button type="submit"> Add Shift</button>
        </form>
    );
};
export default ShiftForm;