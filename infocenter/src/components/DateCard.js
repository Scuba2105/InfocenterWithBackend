export function DateCard({date, dateBoundary, dateOptions}) {
    const month = date.toDateString(('en-us', dateOptions)).split(" ")[1];
    const dayNumber = date.toDateString(('en-us', dateOptions)).split(" ")[2];
    const lastDigit = dayNumber.split("")[1];
    const suffix= lastDigit === "1" ? 'st' : lastDigit === "2" ? 'nd' : lastDigit === "3" ? 'rd' : 'th';
    
    return (
        <div className="date-card">
            <span className="card-head">{dateBoundary === "lower" ? "First Day" : "Last Day"}</span>
            <div className="date-card-data">
                <span className="date-card-month">{month}</span>
                <span className="date-card-day">{dayNumber.replace(/^0/, "")}<span className="suffix">{suffix}</span></span>
            </div>
        </div>
    )
}