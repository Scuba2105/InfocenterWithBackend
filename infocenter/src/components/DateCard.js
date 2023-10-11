export function DateCard({date, dateBoundary, dateOptions}) {
    return (
        <div className="date-card">
            <span className="date-card-head">{dateBoundary === "lower" ? "Start Date" : "End Date"}</span>
            <div className="date-card-data">
                <span className="date-card-month">{date.toDateString(('en-us', dateOptions)).split(" ")[1]}</span>
                <span className="date-card-day">{date.toDateString(('en-us', dateOptions)).split(" ")[2]}</span>
            </div>
        </div>
    )
}