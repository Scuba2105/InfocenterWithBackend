export function DateCard({date, size, dateBoundary, dateOptions, headColor}) {
    const month = date.toDateString(('en-us', dateOptions)).split(" ")[1];
    const dayNumber = date.toDateString(('en-us', dateOptions)).split(" ")[2];
    const firstDigit = dayNumber.split("")[0];
    const lastDigit = dayNumber.split("")[1];
    const suffix = lastDigit === "1" && firstDigit !== "1" ? 'st' : 
                  lastDigit === "2" && firstDigit !== "1" ? 'nd' :
                  lastDigit === "3" && firstDigit !== "1" ? 'rd' : 
                  'th';
    
    if (size === "small") {
        return (
            <div className="date-card date-card-small">
                <span className="card-head card-head-small flex-c" style={dateBoundary === "lower" ? {backgroundColor: "#06BF88"} : null}></span>
                <div className="date-card-data flex-c-col">
                    <span className="date-card-month-small">{month}</span>
                    <span className="date-card-day-small">{dayNumber.replace(/^0/, "")}<span className="suffix">{suffix}</span></span>
                </div>
            </div>
        ) 
    }
    return (
        <div className="date-card">
            <span className="card-head flex-c" style={{backgroundColor: headColor}}>{dateBoundary === "lower" ? "Start Date" : "End Date"}</span>
            <div className="date-card-data flex-c-col">
                <span className="date-card-month">{month}</span>
                <span className="date-card-day">{dayNumber.replace(/^0/, "")}<span className="suffix">{suffix}</span></span>
            </div>
        </div>
    )
}