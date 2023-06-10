const updateFormStyles = {
    position: 'relative',
    top: '-500px',
    left: '-250px',
    height: '300px',
    width: '400px',
    backgroundColor: 'white',
    border: '1px solid black'
};

export function DeviceUpdateForm({selectedData, closeUpdate}) {
    return (
        <div className="config-modal">
            <div className="modal-title-bar">
                <h2 className="model-title">{`Update ${selectedData.model} Data`}</h2> 
                <img className="cross" src={`${process.env.PUBLIC_URL}/images/cross.svg`} alt="cross" onClick={closeUpdate}></img>   
            </div>
            <div className="modal-display">
                <div className="device-input-container">
                    <label>Manufacturer: </label><input type="text" disabled className="device-text-input" placeholder={selectedData.manufacturer}></input>
                </div>
                <div className="device-input-container"> 
                    <label>Service Manual: </label><input type="file" className="device-file-upload" id="file1" name="service-upload"></input>
                </div>    
                <div className="device-input-container">
                    <label>User Manual: </label><input type="file" className="device-file-upload" id="file2" name="user-upload"></input>
                </div>    
                <div className="device-input-container">
                    <label>Add New Config: </label><input type="file" className="device-file-upload" id="file1" name="config-upload"></input>
                </div>
                <div className="device-input-container">
                    <label>Software File Location: </label><input type="text" disabled className="device-text-input" placeholder={selectedData.software}></input>
                </div>
            </div>
        </div>
    )
} 
