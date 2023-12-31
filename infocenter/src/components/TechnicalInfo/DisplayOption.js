import { SelectInput } from "../SelectInput";
import { Input } from "../Input";
import { capitaliseFirstLetters } from "../../utils/utils";
import { Cross, Tick, AddSquare, TrashCan } from "../../svg";
import { TooltipButton } from "../TooltipButton";

const hospitals = ['JOHN HUNTER HOSPITAL', 'ROYAL NEWCASTLE CENTRE', 'MAITLAND HOSPITAL', 'NEW MAITLAND HOSPITAL', 'MATER HOSPITAL','BELMONT HOSPITAL', 'BULAHDELAH HOSPITAL', 'KURRI KURRI HOSPITAL', 
'CESSNOCK HOSPITAL', 'TAREE HOSPITAL', 'DUNGOG HOSPITAL', 'SINGLETON HOSPITAL', 'DENMAN MPS','GLOUCESTOR HOSPITAL', 'SCONE HOSPITAL', 'MUSWELBROOK HOSPITAL', 
'MURRURUNDI HOSPITAL', 'MERRIWA MPS', 'TAMWORTH HOSPITAL', 'WALCHA MPS', 'QUIRINDI HOSPITAL', 'GUNNEDAH HOSPITAL', 'MANILLA MPS', 
'ARMIDALE HOSPITAL', 'BARRABA MPS', 'GUYRA MPS', 'NARRABRI HOSPITAL',
'WEEWAA HOSPITAL', 'GLEN INNES HOSPITAL', 'MOREE HOSPITAL', 'WARIALDA MPS', 'INVERELL HOSPITAL', 
'TENTERFIELD HOSPITAL', 'HUNTER REGION', 'NEW ENGLAND REGION'];

const configTypes = {TC50: ['XML', 'DAT'], "Perfusor Space": ['Modification Data', 'Disposable Articles', 'Drug Library']};

const defaultAccessTypes = ['Configuration Menu', 'Service Mode', 'Admin Password', 'Configuration Mode',
'Demo Mode', 'Biomed Menu', 'Engineering Mode', 'Diagnostic Tools', 'Wireless Network Credentials',
'Setup Mode', 'Factory Default', 'Maintenance Menu', 'Factory Menu', 'Clinical Configuration',
'Biomed Login', 'Diagnostics Menu', 'Clincal Settings'];

const hospitalLocations = hospitals.map((hospital) => {
    return capitaliseFirstLetters(hospital)
}).sort();

export function DisplayOption({equipmentEditPermissions, selectedOption, selectedData, fileNumber, setFileNumber, showMessage, updateFileCount, customAccessType, toggleAccessType, customPasswordType, togglePasswordType}) {
    
    if (selectedOption === 'ServiceManual') {
        return (
            <div key={selectedOption} className="device-input-container flex-c-col" style={{marginBottom: 80 + 'px'}}> 
                <label className="available-label flex-c">Currently Available: {selectedData.serviceManual ? <Tick color="rgb(7, 171, 138)" /> : <Cross color="#de0d37" />} </label>
                <Input type="device-update-file" inputType="file" identifier="update-device-file" labelText={equipmentEditPermissions ? "Update Service Manual:" : "Request Updated Service Manual:"} uniqueId="file1" name="service-upload"/>
            </div>
        );
    }
    else if (selectedOption === 'UserManual') {
        return (
            <div key={selectedOption} className="device-input-container flex-c-col" style={{marginBottom: 80 + 'px'}}>
                <label className="available-label flex-c">Currently Available: {selectedData.userManual ? <Tick color="rgb(7, 171, 138)" /> : <Cross color="#de0d37" />} </label>
                <Input type="device-update-file" inputType="file" identifier="update-device-file" labelText={equipmentEditPermissions ? "Update User Manual:" : "Request Updated User Manual:"} uniqueId="file2" name="user-upload"/>
            </div>
        );
    }
    else if (selectedOption === 'Software') {
        return (
            <div key={selectedOption} className="device-input-container flex-c-col">
                <label className="update-device-file-label">Software Type:</label>
                <div className="software-type flex-c">
                    <input type="radio" id="device-software" name="software-type" value="device-software"></input>
                    <label id="device-software-label" htmlFor="device-software">Device Software</label><br></br>
                    <input type="radio" id="service-software" name="software-type" value="service-software"></input>
                    <label id="service-software-label" htmlFor="service-software">Service Software</label><br></br>
                </div>
                <label className="update-device-file-label">{equipmentEditPermissions ? "Update Software Location:" : "Request Updated Software Location:"}</label><input type="text" className="device-text-input" ></input>
            </div>
        );
    }
    else if (selectedOption === 'Configs') {
        return (
            <div key={selectedOption} id="device-config-container" className="device-input-container flex-c-col">
                <h4 className="flex-c size-100">{equipmentEditPermissions ? "Add New Configuration" : "Request New Configuration"}</h4>
                <div className="config-info">
                    <SelectInput type="form-select-input" label='Hospital' optionData={hospitalLocations} />
                    {/^MX/.test(selectedData.model) || selectedData.model === 'X2' || selectedData.model === 'X3' ? <Input inputType='text' identifier='config-data' labelText='Options (optional)' placeholdertext='eg. A06, H10, C06 etc'/> : 
                    selectedData.model === 'TC50' ? <SelectInput type="form-select-input" label='Configuration Type' optionData={configTypes[selectedData.model]}/> : 
                    selectedData.model === 'Perfusor Space' ? <SelectInput type="form-select-input" label='Configuration Type' optionData={configTypes[selectedData.model]}/> :
                    <Input inputType='text' identifier='config-data' labelText='Configuration Type' placeholdertext='eg. XML, DAT, filetype, description etc.'/>}
                    <Input inputType='text' identifier='config-data' labelText='Department' placeholdertext='eg. ICU, ED, Ward H1 etc.'/>
                    <Input inputType='text' identifier='config-data' labelText='Software Rev. (optional)' placeholdertext='eg. M.03.01, L.01.02'/>
                    <Input inputType='text' identifier='config-data' labelText='Sub-Location (optional)' placeholdertext='eg. Transport, Paediatric etc.'/>
                    <Input inputType='date' identifier='date-entry' labelText='Date Created'/>
                </div>
                <div className="config-file-container flex-c-col size-100">
                    <label className="config-file-input-label">Select Config File</label>
                    <input type="file" className="device-file-upload flex-c" id="config-file" name="config-upload"></input>
                </div>
            </div> 
        );
    }
    else if (selectedOption === 'OtherDocuments'){
        return (
            <div key={selectedOption} className="other-input-container flex-c-col">
                <h4 className="flex-c size-100">{equipmentEditPermissions ? "Add New Document/s" : "Request New Document/s"}</h4>
                {fileNumber.map((number) => {
                    return (
                    <div key={`container-${number}`} className="description-file-container flex-c">
                        <div className="label-input-container">
                            <label className="other-doc-label" key={`label-desc-${number}`}>{`File ${number} Description:`} </label>
                            <input key={`text${number}`} type="text" className="other-doc-text-input text-input" placeholder="Enter a short title/description" name={`description-${number}`}></input>
                        </div>
                        <div className="label-input-container2">
                            <label className="other-doc-label" key={`label-input-${number}`}>{`File ${number}:`} </label>
                            <input key={`file${number}`} type="file" className="other-doc-file-upload file-input" name="user-upload"></input>
                        </div>
                    </div>
                    );
                })}
                <div className="other-file-button-container flex-c">
                    {fileNumber[fileNumber.length - 1] < 4 && <div className="other-doc-add-rm flex-c form-btn-transition" id="add-another-file" onClick={(e) => updateFileCount(e, fileNumber, setFileNumber, showMessage)} style={fileNumber.length === 1 ? {marginRight: '0px'} : {marginRight: '15px'}}><AddSquare color="rgb(5, 234, 146)" translateX={-8}/>Add File</div>}
                    {fileNumber.length !== 1 && <div className="other-doc-add-rm flex-c form-btn-transition" id="remove-file" onClick={(e) => updateFileCount(e, fileNumber, setFileNumber, showMessage)} style={fileNumber.length === 4 ? {marginLeft: '0px'} : {marginLeft: '15px'}}><TrashCan color="#fd6673" translateX={-8}/>Delete File</div>}
                </div>
            </div>
        );
    }
    else {
        return (
            <div key={selectedOption} className="device-password-update-container flex-c-col" style={{marginTop: 40 + 'px', marginBottom: 60 + 'px'}}>
                <h4 className="flex-c size-100" style={{color: "white"}}>{equipmentEditPermissions ? "Add New Password" : "Request New Password"}</h4>
                <div className="edit-add-new-container flex-c" style={{transform: `translateY(-10px)`}}>
                    <TooltipButton content={customAccessType ? "Undo" :"Custom Type"} boolean={customAccessType} translateY={customAccessType ? "6px" : "6px"} toggleFunction={toggleAccessType}/>
                    {customAccessType ? <Input inputType="text" identifier="add-new" labelText="Restricted Access Type" placeholdertext={`Enter the restricted access type`} /> : 
                    <SelectInput type="form-select-input" label="Restricted Access Type" optionData={defaultAccessTypes.sort()}/> }
                    <div className="add-new-aligner"></div>
                </div>
                <div className="edit-add-new-container flex-c" style={{transform: `translateY(-15px)`}}>
                    <TooltipButton content={customPasswordType ? "Undo" :"Custom Type"} boolean={customPasswordType} translateY={customPasswordType ? "6px" : "6px"} toggleFunction={togglePasswordType}/>
                    {customPasswordType ? <Input inputType="text" identifier="add-new" labelText="Credential Type" placeholdertext={`Enter custom credential type`} /> : 
                    <SelectInput type="form-select-input" label="Credential Type" optionData={["Username", "Password"]}/> }
                    <div className="add-new-aligner"></div>
                </div> 
                <Input inputType='text' identifier='password-add' labelText='Credential Value' placeholdertext='Please enter the password/username'/>  
            </div>
        )
    }
}

    