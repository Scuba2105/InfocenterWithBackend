import useMediaQueries from "media-queries-in-react";
import { SelectInput } from "./SelectInput";
import { Input } from "./Input";

const formTypes = ["Repair Request Generation", "Check Thermometer Returns", "Thermometer Clean-Up"]
const bmeInputs = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function sendRequestData(e) {
    const parentForm = e.target.parentNode.parentNode;
    const requestorInput = parentForm.querySelector('.employee-requestor-select');
    const bmeInputs = parentForm.querySelectorAll('.bme-input');
    
}

function ThermometerFormButton({buttonText}) {
    return (
        <div className="thermometer-form-button-container">
            <div className="thermometer-form-button" onClick={sendRequestData}>{buttonText}</div>
        </div>
    );
}

function ThermometerForm1({staffNames}) {
    return (
        <>
            <SelectInput label="Employee Requestor" optionData={staffNames}></SelectInput>
            <div className="bme-container">    
                {bmeInputs.map((input) => {
                    return (
                        <Input inputType="text" identifier="bme" labelText={`BME ${input}`}></Input>
                    );
                })}
            </div>
            <ThermometerFormButton buttonText="Generate Request Form"/>
        </>
        
    );
}

export function ThermometerManagement({staffNames}) {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    }); 

    return (
        <div className="thermometers-utility">
            {formTypes.map((type, index) => {
                return (
                    <form key={`thermometer-form${index}`} className={mediaQueries.laptop ? "thermometer-form-laptop" : "thermometer-form-desktop"}>
                        <h4>{type}</h4>
                        {index === 0 && <ThermometerForm1 staffNames={staffNames} ></ThermometerForm1>}
                    </form>
                )
            })}
        </div>
    );
}