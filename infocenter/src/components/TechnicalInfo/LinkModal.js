import { useState } from "react";
import { SelectInput } from "../SelectInput";
import { ConfigDisplay } from "./ConfigDisplay";
import { ClipboardCopy } from "../CopyToClipboard";
import { Documents } from "./Documents";
import { DocumentEditRemove } from "./DocumentEditRemove";
import { ConfigEditRemove } from "./ConfigEditRemove";

function passwordEntryClassName(num) {
    if (num === 0) {
        return "main-link-button"
    }
    else if (num === 1) {
        return "alternate-link-button"
    }
}

function generateConfigData(hospitals, selectedData) {
    let dataArray = [];
    hospitals.forEach((hospital) => {
        const hospitalConfigString = selectedData.config[hospital].map((config) => {
            const linkArray = (config.split('/'));
            const configDataArray = linkArray[linkArray.length - 1].split('_');
            return configDataArray;
        })
        dataArray.push(hospitalConfigString);
    });

    return dataArray;
}

function parseConfigData(configData) {
    const department = formatDepartmentString(configData[2]);
    const options = configData[3] === 'none' ? '-' : configData[3].replace(/-/g, ', ');
    const software = configData[4] === 'none' ? '-' : configData[4];
    const dateCreated = configData[configData.length -1].split('.').slice(0, -1).join('/');

    return [department, options, software, dateCreated];
}

function formatDepartmentString(word) {
    const wordArray = word.split('--');
    const formattedDepartment = wordArray.map((word) => {
        const formattedWord = word.split('-').join(' ');
        return formattedWord;
    }).join(' - ');
    
    return formattedDepartment;
}

// Determines whether the documents form is shown or not
function showForm(setDocumentsEditVisible, setCurrentDocument, link, description, extension) {
    setDocumentsEditVisible(true);
    setCurrentDocument({description: description, link: link, extension: extension});
}

function closeForm(setDocumentsEditVisible) {
    setDocumentsEditVisible(false);
}

function openConfigEditForm(setConfigEditVisible, currentConfig, setCurrentConfig) {
    setConfigEditVisible(true);
    setCurrentConfig(currentConfig);
}

function closeConfigEditForm(setConfigEditVisible) {
    setConfigEditVisible(false);
}

export function LinkModal({selectedData, modalType, queryClient, showMessage, closeDialog, closeAddModal}) {
    
    const [hospitalsIndex, setHospitalsIndex] = useState(0);
    const [departmentsIndex, setDepartmentsIndex] = useState(0);
    const [configIndex, setConfigIndex] = useState(0);

    // Store state as to whether documents view or edit/remove form is displayed.
    const [documentsEditVisible, setDocumentsEditVisible] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null);

    // Store state as to whether configs view or edit/remove is displayed.
    const [configEditVisible, setConfigEditVisible] = useState(false)
    const [currentConfig, setCurrentConfig] = useState(null);
    
    if (modalType === "documents") {

        const documentData = selectedData.documents;
        if (documentsEditVisible) {
            return (
               <DocumentEditRemove selectedData={selectedData} currentDocument={currentDocument} closeForm={() => closeForm(setDocumentsEditVisible)} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} /> 
            )
        } 
        else {
            return (
                <div className="modal-display" style={{justifyContent: 'flex-start'}}>
                    <h3 className="documents-heading">Available Documentation</h3>
                    {documentData.map((document) => {
                        const description = document.label;
                        const link = document.filePath;
                        const extension = link.split('.').slice(-1)[0];
                        return (
                                <Documents key={`${description}.${extension}`} description={description} link={link} extension={extension} showForm={showForm} setCurrentDocument={setCurrentDocument} setFormVisible={setDocumentsEditVisible}/>
                            )
                    })}
                </div>
            )
        }
    }

    if (modalType === "software") {
        
        const softwareData = selectedData.software;
        
        return (
            <div className="modal-display" style={{justifyContent: 'center', maxHeight: 250 + 'px'}}>
                <div className="software-summary flex-c-col">
                    <label className="software-device-label">Device Software Location:</label>
                    <label className="software-device-location flex-c">{softwareData["device-software"] || "N/A"}</label>
                    <div className="clipboard-copy-container flex-c">
                        <ClipboardCopy copyText={softwareData["device-software"] || "N/A"} />
                        <div className="clipboard-aligner"></div>
                    </div>
                </div>
                <div className="software-summary flex-c-col">
                    <label className="software-device-label">Service Software Location:</label>
                    <label className="software-device-location flex-c">{softwareData["service-software"] || "N/A"}</label>
                    <div className="clipboard-copy-container flex-c">
                        <ClipboardCopy copyText={softwareData["service-software"] || "N/A"} />
                        <div className="clipboard-aligner"></div>
                    </div>
                </div>               
            </div>
        );
    }

    if (modalType === "config") {
            
        const hospitals = Object.keys(selectedData.config) 
        const configData = generateConfigData(hospitals, selectedData);
        
        // Generate the config information from the json link
        const selectedHospitalConfigs = configData[hospitalsIndex];
        
        const parsedConfigData = selectedHospitalConfigs.map((configString) => {
            return parseConfigData(configString);
        });

        function getDepartments() {
            const departments = parsedConfigData.reduce((acc, curr) => {
                if (!acc.includes(curr[0])) {
                    acc.push(curr[0])
                    return acc;
                }
                else {
                    return acc;
                }
            }, []);
            
            return departments;
        }
        
        function onHospitalChange(e) {
            const newHospitalIndex = hospitals.indexOf(e.target.value);
            setHospitalsIndex(newHospitalIndex);
            setDepartmentsIndex(0);
            setConfigIndex(0);
        }

        function onDepartmentChange(e) {
            const newDepartmentIndex = getDepartments().indexOf(e.target.value);        
            setDepartmentsIndex(newDepartmentIndex);
            setConfigIndex(0);
        }
        
        if (configEditVisible) {
            return (
               <ConfigEditRemove currentConfig={currentConfig} device={selectedData.model} manufacturer={selectedData.manufacturer} hospital={hospitals[hospitalsIndex]} department={getDepartments()[departmentsIndex]} closeForm={() => closeConfigEditForm(setConfigEditVisible)} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} /> 
            )
        } 
        else {
            return (
                <div className="modal-display">
                    <SelectInput type="form-select-input" label="Hospital" optionData={hospitals} onChange={onHospitalChange} />
                    <SelectInput type="form-select-input" label="Department" value={getDepartments()[departmentsIndex]} optionData={getDepartments()} onChange={onDepartmentChange} />
                    <ConfigDisplay selectedData={selectedData} parsedConfigData={parsedConfigData} hospitals={hospitals} departmentName={getDepartments()[departmentsIndex]} departmentsIndex={departmentsIndex} hospitalsIndex={hospitalsIndex} configIndex={configIndex} setConfigIndex={setConfigIndex} openConfigEditForm={openConfigEditForm} setConfigEditVisible={setConfigEditVisible} currentConfig={currentConfig} setCurrentConfig={setCurrentConfig} />    
                </div>
            );
        }
    }

    if (modalType === "passwords") {
        const passwordData = selectedData.passwords;

        return (
            <div className="password-display flex-c-col">
                {passwordData.map((entry, index) => {
                    return (
                        <div className={`password-container ${passwordEntryClassName(index % 2)} flex-c-col inactive`} key={`${selectedData.model}${index}`}>
                            <label className="password-type">{`${entry.type}`}</label>
                            <div className="password-info flex-c-col">
                                {entry.values.map((pword) => {
                                        const desc = pword.split(':')[0];
                                        const value = pword.split(':')[1];
                                        const returnHTML = value !== undefined ? 
                                        <label ><span className="bolder">{desc}</span>{`:${value}`}</label> :
                                        <label >{`${desc}`}</label>
                                        return returnHTML
                                })}
                            </div>
                        </div>
                    ) 
                })}
            </div>
        )
    }
}
