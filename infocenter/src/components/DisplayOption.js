import { SelectInput } from "./SelectInput";
import { Input } from "./Input";
import { capitaliseFirstLetters } from "../utils/utils";
import { Cross, Tick } from "../svg";
import { serverConfig } from "../server";
import useMediaQueries from "media-queries-in-react";

const hospitals = ['JOHN HUNTER HOSPITAL', 'ROYAL NEWCASTLE CENTRE', 'MAITLAND HOSPITAL', 'NEW MAITLAND HOSPITAL', 'MATER HOSPITAL','BELMONT HOSPITAL', 'BULAHDELAH HOSPITAL', 'KURRI KURRI HOSPITAL', 
'CESSNOCK HOSPITAL', 'TAREE HOSPITAL', 'DUNGOG HOSPITAL', 'SINGLETON HOSPITAL', 'DENMAN MPS','GLOUCESTOR HOSPITAL', 'SCONE HOSPITAL', 'MUSWELBROOK HOSPITAL', 
'MURRURUNDI HOSPITAL', 'MERRIWA MPS', 'TAMWORTH HOSPITAL', 'WALCHA MPS', 'QUIRINDI HOSPITAL', 'GUNNEDAH HOSPITAL', 'MANILLA MPS', 
'ARMIDALE HOSPITAL', 'BARRABA MPS', 'GUYRA MPS', 'NARRABRI HOSPITAL',
'WEEWAA HOSPITAL', 'GLEN INNES HOSPITAL', 'MOREE HOSPITAL', 'WARIALDA MPS', 'INVERELL HOSPITAL', 
'TENTERFIELD HOSPITAL', 'HUNTER REGION', 'NEW ENGLAND REGION'];

const configTypes = {TC50: ['XML', 'DAT'], "Perfusor Space": ['Modification Data', 'Disposable Articles', 'Drug Library']};

const hospitalLocations = hospitals.map((hospital) => {
    return capitaliseFirstLetters(hospital)
}).sort();

export function DisplayOption({selectedOption, selectedData, fileNumber, setFileNumber, showMessage, updateFileCount}) {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    if (selectedOption === 'Service Manual') {
        return (
            <div key={selectedOption} className={mediaQueries.laptop ? "device-input-container-laptop" : "device-input-container-desktop"}> 
                <label className="available-label">Currently Available: {selectedData.serviceManual ? <Tick color="rgb(7, 171, 138)" /> : <Cross color="#de0d37" />} </label>
                <label>Update Service Manual: </label><input type="file" className="device-file-upload" id="file1" name="service-upload"></input>
            </div>
        );
    }
    else if (selectedOption === 'User Manual') {
        return (
            <div key={selectedOption} className={mediaQueries.laptop ? "device-input-container-laptop" : "device-input-container-desktop"}>
                <label className="available-label">Currently Available: {selectedData.userManual ? <Tick color="rgb(7, 171, 138)" /> : <Cross color="#de0d37" />} </label>
                <label>Update User Manual: </label><input type="file" className="device-file-upload" id="file2" name="user-upload"></input>
            </div>
        );
    }
    else if (selectedOption === 'Software') {
        return (
            <div key={selectedOption} className={mediaQueries.laptop ? "device-input-container-laptop" : "device-input-container-desktop"}>
                {/*<label id="software-available" className="available-label">Current Location Provided: {selectedData.software !== "" ? <Tick color="rgb(7, 171, 138)" size="18px" margin="25px" /> : <Cross color="#de0d37" size="18px" margin="25px" />} </label>*/}
                <label>Software Type</label>
                <div className="software-type">
                    <input type="radio" id="device-software" name="software-type" value="device-software"></input>
                    <label id="device-software-label" htmlFor="device-software">Device Software</label><br></br>
                    <input type="radio" id="service-software" name="software-type" value="service-software"></input>
                    <label id="service-software-label" htmlFor="service-software">Service Software</label><br></br>
                </div>
                <label>Update Software File Location: </label><input type="text" className="device-text-input" ></input>
            </div>
        );
    }
    else if (selectedOption === 'Configs') {
        return (
            <div key={selectedOption} id={mediaQueries.laptop ? "device-config-container-laptop" : "device-config-container-desktop"} className={mediaQueries.laptop ? "device-input-container-laptop" : "device-input-container-desktop"}>
                <h4 id="add-config-heading">Add New Configuration</h4>
                <div className="config-info">
                    <SelectInput label='Hospital' optionData={hospitalLocations} />
                    {/^MX/.test(selectedData.model) || selectedData.model === 'X2' || selectedData.model === 'X3' ? <Input inputType='text' identifier='config-data' labelText='Options (optional)' placeholdertext='eg. A06, H10, C06 etc'/> : 
                    selectedData.model === 'TC50' ? <SelectInput label='Configuration Type' optionData={configTypes[selectedData.model]}/> : 
                    selectedData.model === 'Perfusor Space' ? <SelectInput label='Configuration Type' optionData={configTypes[selectedData.model]}/> :
                    <Input inputType='text' identifier='config-data' labelText='Configuration Type' placeholdertext='eg. XML, DAT, filetype, description etc.'/>}
                    <Input inputType='text' identifier='config-data' labelText='Department' placeholdertext='eg. ICU, ED, Ward H1 etc.'/>
                    <Input inputType='text' identifier='config-data' labelText='Software Rev. (optional)' placeholdertext='eg. M.03.01, L.01.02'/>
                    <Input inputType='text' identifier='config-data' labelText='Sub-Location (optional)' placeholdertext='eg. Transport, Paediatric etc.'/>
                    <Input inputType='date' identifier='date-entry' labelText='Date Created'/>
                </div>
                <div className="config-file-container">
                    <label>Select Config File</label>
                    <input type="file" className="device-file-upload" id="config-file" name="config-upload"></input>
                </div>
            </div> 
        );
    }
    else {
        return (
            <div key={selectedOption} className="other-input-container">
                {fileNumber.map((number) => {
                    return (
                    <div key={`container-${number}`} className={mediaQueries.laptop ? "description-file-container-laptop" : "description-file-container-desktop"}>
                        <div className={mediaQueries.laptop ? "label-input-container1-laptop" : "label-input-container1-desktop"}>
                            <label key={`label-desc-${number}`}>{`File ${number} Description:`} </label>
                            <input key={`text${number}`} type="text" className={mediaQueries.laptop ? "other-doc-text-input-laptop text-input" : "other-doc-text-input-desktop text-input"}  placeholder="Enter a short title/description" name={`description-${number}`}></input>
                        </div>
                        <div className={mediaQueries.laptop ? "label-input-container2-laptop" : "label-input-container2-desktop"}>
                            <label key={`label-input-${number}`}>{`File ${number}:`} </label>
                            <input key={`file${number}`} type="file" className={mediaQueries.laptop ? "other-doc-file-upload-laptop" : "other-doc-file-upload-desktop"} name="user-upload"></input>
                        </div>
                    </div>
                    );
                })
                
                }
                <div className={mediaQueries.laptop ? "other-file-button-container-laptop" : "other-file-button-container-desktop"}>
                    {fileNumber[fileNumber.length - 1] < 4 && <div id="add-another-file" onClick={(e) => updateFileCount(e, fileNumber, setFileNumber, showMessage)} style={fileNumber.length === 1 ? {marginRight: '0px'} : {marginRight: '15px'}}><img className="file-add-remove-image" src={`http://${serverConfig.host}:${serverConfig.port}/images/add-square.svg`} alt="add-square"></img>Add File</div>}
                    {fileNumber.length !== 1 && <div id="remove-file" onClick={(e) => updateFileCount(e, fileNumber, setFileNumber, showMessage)} style={fileNumber.length === 4 ? {marginLeft: '0px'} : {marginLeft: '15px'}}><img className="file-add-remove-image" src={`http://${serverConfig.host}:${serverConfig.port}/images/trash-can.svg`} alt="trash"></img>Delete File</div>}
                </div>
            </div>
        );
    }
}

    