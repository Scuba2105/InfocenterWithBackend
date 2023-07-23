import useMediaQueries from "media-queries-in-react";
import { SelectInput } from "./SelectInput";
import { Input } from "./Input";

const formTypes = ["Repair Request Generation", "Check Thermometer Returns", "Thermometer Clean-Up"]
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
    const regex = new RegExp(/^[0-9]{5}$|(?<=E)[0-9]+/, 'g');
    
    // Verify the input values correspond to valid BME numbers
    bmeInputs.forEach((bmeInput) => {
        if (bmeInput.value !== "") {
            inputValues.push(bmeInput.value);
        } 
    }) 
       
    const bmeNumbers = [];
    for (const value in inputValues) {
        const bme = inputValues[value].trim();
        if (isValidBME(bme)) {
            bmeNumbers.push(bme);
        }
        else {
            showMessage("error", `The input BME #: ${bme} is not recognised as a valid BME. Please confirm the entered number and contact an administator if required.`)
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
        const res = await fetch(`http://localhost:5000/Thermometers/${formTypes[index].replace(/\s/ig, "")}`, {
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
        console.log(res.status);
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

function ThermometerFormButton({buttonText, closeDialog, showMessage, index}) {
    return (
        <div className="thermometer-form-button-container">
            <div className="thermometer-form-button" onClick={(e) => sendRequestData(closeDialog, showMessage, index, e)}>{buttonText}</div>
        </div>
    );
}

function ThermometerForm1({staffNames, closeDialog, showMessage, index}) {
    return (
        <>
            <SelectInput label="Employee Requestor" optionData={staffNames}></SelectInput>
            <div className="bme-container">    
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

export function ThermometerManagement({staffNames, closeDialog, showMessage}) {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    }); 

    return (
        <>
            <div className="thermometers-utility">
            {formTypes.map((type, index) => {
                return (
                    <form key={`thermometer-form${index}`} className={mediaQueries.laptop ? "thermometer-form-laptop" : "thermometer-form-desktop"}>
                        <h4>{type}</h4>
                        {index === 0 && <ThermometerForm1 staffNames={staffNames} closeDialog={closeDialog} showMessage={showMessage} index={index}></ThermometerForm1>}
                    </form>
                )
            })}
            </div>
        </>
        
    );
}