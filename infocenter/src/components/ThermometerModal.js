export function ThermometerModal({batchData, type}) {
    
    const date = new Date(batchData[0].date);
    const dateString = date.toLocaleDateString();

    if (type === "check") {
        return (
            <div className="thermometer-modal-container">
                <h4 id="thermometer-batch-heading">{`Thermometer Batch ${dateString}`}</h4>
                <p id="thermometer-batch-info">*The following list of thermometer have not yet been received back from repair/calibration.</p>
                <div className="thermometer-list-container">
                    {batchData.map((entry, index) => {
                        return (
                            <div key={`check-data-container${index}`} className="check-data-container">
                                <label id="thermometer-bme">{`BME #: ${entry.bme}`}</label>
                                <label id="thermometer-serial">{`Serial #: ${entry.serial}`}</label>
                                <div id="thermometer-checkbox">
                                    <input type="checkbox"></input>
                                </div>
                            </div> 
                        );
                    })}
                </div>
            </div>
        )
    }
    else if (type === "disposal") {

    }
}