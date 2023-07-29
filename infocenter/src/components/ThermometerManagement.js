import useMediaQueries from "media-queries-in-react";
import { useState } from "react";
import { SelectInput } from "./SelectInput";
import { Input } from "./Input";
import { serverConfig } from "../server";
import { getOrdinalNumber } from "../utils/utils.js";
import { ModalSkeleton } from "./ModalSkeleton";

const formTypes = ["Repair Request Generation", "Manage Thermometer Returns"];
const bmeInputs = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function isValidBME(bme) {
    const firstNumber = bme[0];
    const otherNumbers = bme.split("").slice(1).join("");
    if (bme.length === 5 && !isNaN(bme)) {
        return true;
    }
    else if ((firstNumber === "E" || firstNumber === "e") && !isNaN(otherNumbers)) {
        return true;
    }
    else {
        return false;
    }
}

async function sendRequestData(closeDialog, showMessage, index, e) {
    const parentForm = e.target.parentNode.parentNode;
    const requestorInput = parentForm.querySelector('.employee-requestor-select');
    const bmeInputs = parentForm.querySelectorAll('.bme-input');

    const requestor = requestorInput.value;
    const inputValues = [];
        
    // Verify the input values correspond to valid BME numbers
    bmeInputs.forEach((bmeInput) => {
        if (bmeInput.value !== "") {
            inputValues.push(bmeInput.value);
        } 
    }) 
       
    const bmeNumbers = [];
    for (const value in inputValues) {
        const bme = inputValues[value].trim();
        if (bmeNumbers.includes(bme)) {
            const inputNumber = Number(value) + 1;
            const inputNumberString = String(inputNumber);
            showMessage("error", `The ${getOrdinalNumber(inputNumberString)} input BME #: ${bme} is duplicated. Please check the entered values.`)
            return;
        }
        else if (isValidBME(bme)) {
            bmeNumbers.push(bme);
        }
        else {
            const inputNumber = Number(value) + 1;
            const inputNumberString = String(inputNumber);
            showMessage("error", `The ${getOrdinalNumber(inputNumberString)} input BME #: ${bme} is not recognised as a valid BME. Please confirm the entered number and contact an administator if required.`)
            return;
        }        
    }

    // Check if at least one BME number has been entered
    if (bmeNumbers.length === 0) {
        showMessage("warning", `No BME numbers have been entered into the input fields. Please enter at least one value and try again.`)
        return;
    }

    // Stringify the input for the json 
    const requestData = JSON.stringify({name: requestor, "bme-numbers": bmeNumbers})

    // Show the uploading dialog while communicating with server
    showMessage("uploading", `Generating Repair Request Form...`);

    try {
        // Send the data to the backend
        const res = await fetch(`http://${serverConfig.host}:${serverConfig.port}/Thermometers/${formTypes[index].replace(/\s/ig, "")}`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
            responseType: "arraybuffer",
            headers: {
                'Content-Type': 'application/json'
                },
            body: requestData
        });
        
        // If error message is sent form server set response based on error status.
        if (res.status === 400) {
            const error = await res.json();
            throw new Error(error.message)
        }
        
        // Create a blob from response arraybuffer.
        const data = await res.blob();

        // Build a URL from the file.
        const fileURL = URL.createObjectURL(data);

        // Open the URL on new Window.
        window.open(fileURL);

        // Close the upload dialog box. 
        closeDialog();

        // Reset the form inputs to empty.
        bmeInputs.forEach((bmeInput) => {
            bmeInput.value = "";
        }) 
    } catch (error) {
        showMessage("error-request", `"${error.message}"`);
    }
}

async function getReturnBatch(closeDialog, showMessage, setBatchData, openForm, e) {
    const checkContainer = e.currentTarget.parentNode.parentNode;
    const bmeInput = checkContainer.querySelector('.bme-input');
    
    // Get the value of the bme input
    const bme = bmeInput.value;

    if (!isValidBME(bme)) {
        showMessage("error", "The entered BME value is not recognised as a valid BME. Please check the entered value and try again.")        
        return;
    }

    // Strignify the BME data to be uploaded
    const bmeData = JSON.stringify({bme: bme});

    // Show the uploading dialog while communicating with server
    showMessage("uploading", `Retrieving Batch Data...`);

    try {
        // Send the input BME to the backend to fetch the thermometer batch
        const res = await fetch(`http://${serverConfig.host}:${serverConfig.port}/Thermometers/CheckReturns`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
            responseType: "arraybuffer",
            headers: {
                'Content-Type': 'application/json'
                },
            body: bmeData,
        });

        // If error message is sent form server set response based on error status.
        if (res.status === 400) {
            const error = await res.json();
            throw new Error(error.message)
        }

        // Get the data from the JSON response.
        const data = await res.json();
        
        // Close loading dialog.
        closeDialog();

        // Set the data for the component and open form.
        setBatchData(data);
        openForm("check")

    } catch (error) {
        showMessage("error", error.message);
    }
   
}

function getThermometersForDisposal(e) {
    console.log(e.currentTarget);
}

function ThermometerFormButton({buttonText, closeDialog, showMessage, index}) {
    return (
        <div className="thermometer-form-button-container">
            <div className="thermometer-form-button" onClick={(e) => sendRequestData(closeDialog, showMessage, index, e)}>{buttonText}</div>
        </div>
    );
}

function ThermometerCheckButton({buttonText, setBatchData, openForm, getReturnBatch, closeDialog, showMessage}) {
    return (
        <div className="thermometer-form-button-container">
            <div className="thermometer-form-button" onClick={(e) => getReturnBatch(closeDialog, showMessage, setBatchData, openForm, e)}>{buttonText}</div>
        </div>
    );
}

function ThermometerDisposalButton({buttonText, getThermometersForDisposal, closeDialog, showMessage, index}) {
    return (
        <div className="thermometer-form-button-container">
            <div className="thermometer-disposal-button" onClick={getThermometersForDisposal}>{buttonText}</div>
        </div>
    );
}

function ThermometerForm1({staffNames, mediaQueries, closeDialog, showMessage, index}) {
    return (
        <>
            <SelectInput label="Employee Requestor" optionData={staffNames}></SelectInput>
            <div className={mediaQueries.laptop ? "bme-container" : "bme-container-desktop"}>    
                {bmeInputs.map((input) => {
                    return (
                        <Input key={`BME ${input}`} inputType="text" identifier="bme" labelText={`BME ${input}`}></Input>
                    );
                })}
            </div>
            <ThermometerFormButton buttonText="Generate Request Form" closeDialog={closeDialog} showMessage={showMessage} index={index}/>
        </>
    );
}

function ThermometerForm2({mediaQueries, setBatchData, openForm, closeDialog, showMessage, index}) {
    return (
        <>
            <div className="check-container">
                <Input inputType="text" identifier="bme" labelText={`Returned BME`}></Input>
                <p className="check-message">*Please enter any BME from returned delivery of Genius 3 to check what thermometers have been received in the batch.</p>
                <ThermometerCheckButton buttonText="Check Returns" setBatchData={setBatchData} openForm={openForm} getReturnBatch={getReturnBatch} closeDialog={closeDialog} showMessage={showMessage} index={index}/>
            </div>
            <ThermometerDisposalButton buttonText="Manage Disposals" getThermometersForDisposal={getThermometersForDisposal} closeDialog={closeDialog} showMessage={showMessage} index={index}/>
        </>
    );
}

export function ThermometerManagement({staffNames, page, closeDialog, showMessage}) {

    const [formVisible, setFormVisible] = useState(false);
    const [formType, setFormType] = useState(null);  
    const [batchData, setBatchData] = useState(null); 

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    }); 

    function openForm(type) {
        setFormVisible(true);
        setFormType(type);
    }
    
    function closeForm() {
        setFormVisible(false);
    }

    return (
        <>
            <div className="thermometers-utility">
            {formTypes.map((type, index) => {
                return (
                    <form key={`thermometer-form${index}`} className={mediaQueries.laptop ? "thermometer-form-laptop" : "thermometer-form-desktop"}>
                        <h4>{type}</h4>
                        {index === 0 && <ThermometerForm1 staffNames={staffNames} mediaQueries={mediaQueries} closeDialog={closeDialog} showMessage={showMessage} index={index}></ThermometerForm1>}
                        {index === 1 && <ThermometerForm2 mediaQueries={mediaQueries} setBatchData={setBatchData} openForm={openForm} closeDialog={closeDialog} showMessage={showMessage} index={index}></ThermometerForm2>}
                    </form>
                )
            })}
            </div>
            {formVisible && <ModalSkeleton data={batchData} page={page} type={formType} closeModal={closeForm}></ModalSkeleton>}
        </>
        
    );
}