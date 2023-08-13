import useMediaQueries from "media-queries-in-react";
import { SelectInput } from "./SelectInput";
import { Input } from "./Input";
import { useState } from "react";

const saModels = {"Cardinal Health": ["SCD700", "ePump"], "Fresenius Kabi": ["Volumat", "Injectomat", "Agilia SP", "Agilia VP"],
"Ecomed (CTG Transducers)": ""}
const fkaShippingOptions = ["TNT", "FKA Arranged"];

export function ServiceRequestGenerator({staffNames}) {

    const [serviceAgent, setServiceAgent] = useState("Cardinal Health");

    function changeServiceAgent(e) {
        setServiceAgent(e.currentTarget.value);
    }

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    }); 

    const serviceAgents = Object.keys(saModels);

    return (
        <div className="request-page-container">
            <form className={mediaQueries.laptop ? `request-form-laptop` : `request-form-desktop`}>
                <h4>Request Generation Form</h4>
                <div className="input-container">
                    <SelectInput label="Employee Requestor" optionData={staffNames}></SelectInput>
                    <SelectInput label="Service Agent" optionData={serviceAgents} onChange={changeServiceAgent}></SelectInput>
                    {serviceAgent !== "Ecomed (CTG Transducers)" && <Input inputType="text" identifier="bme" labelText={`BME`}></Input>}
                    {saModels[serviceAgent] !== "" && <SelectInput label="Model" optionData={saModels[serviceAgent]} onChange={changeServiceAgent}></SelectInput>}
                    {/*<GenerateFormButton buttonText="Generate Request Form"/>*/} 
                </div>
            </form>
        </div>
    );
}