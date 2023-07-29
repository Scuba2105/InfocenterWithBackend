export function ThermometerModal({batchData, type}) {
    
    if (type === "check") {
        return (
            <div className="thermometer-modal-container">
                {batchData.map((entry) => {
                    return (
                        <div className="check-data-container">
                            <label>{`BME #: ${entry.bme}`}</label>
                            <label>{`Serial #: ${entry.serial}`}</label>
                            <input type="checkbox"></input>
                        </div> 
                    );
                })}
            </div>
        )
    }
    else if (type === "disposal") {

    }
}