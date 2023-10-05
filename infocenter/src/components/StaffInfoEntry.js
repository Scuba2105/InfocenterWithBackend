export function StaffInfoEntry({entry, headerLabel, selectedData, headerColor, defaultColor}) {
    return (
        <div className="info-entry-container">
            <div className="info-entry">
                <h5 className="info-entry-header" style={selectedData.id !== '-' ? {backgroundColor: headerColor(), border: '1px solid black'} : {backgroundColor: defaultColor(), border: '1px solid black'}}>{headerLabel}</h5>
                <span className="info-entry-data" style={{border: '1px solid black'}}>{selectedData[entry] === "" ? "-" : selectedData[entry]}</span>
            </div>
        </div>
    )
}
