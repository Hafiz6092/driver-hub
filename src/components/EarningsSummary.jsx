const EarningsSummary = ({shifts}) => {
    /**
     * calculate total earnings
     * .reduce() takes a list and reduces it to a single number
     * (acc) is the accumulator the running total 
     * shift is the current item we are looking at
     */
    const totalEarnings = shifts.reduce((acc, shift) =>{ 
        return acc + Number(shift.earnings || 0);
    }, 0);
    //calculate total hours
    const totalHours = shifts.reduce((acc, shift) =>{
        return acc + Number(shift.hours || 0);
    }, 0);

    //cwe only run toLocalString() is totalEarning is definitely a number
    const formattedEarnings = typeof totalEarnings === 'number' ?
    totalEarnings.toLocaleString() : '0';
    //calculate hourly rate 
    //we check if totalHours is greater than 0 to avoid 'Divided by zero' errors NaN

    const hourlyRate = totalHours > 0 ? (totalEarnings/totalHours).toFixed(2) : 0;
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            backgroundColor: '#f4f4f9', 
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div>
                <h4>Total Earned</h4>
                {/**we use .toLocalString() to add commas to large numbers */}
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
                    ${formattedEarnings}
                </p>
            </div>

            <div>
                <h4>Total Hours</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {totalHours}h
                </p>
            </div>
            <div>
                <h4>Avg. Hourly</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
                    ${hourlyRate}/hr
                </p>
            </div>

        </div>
    )
}
export default EarningsSummary;