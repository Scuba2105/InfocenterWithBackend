import useMediaQueries from "media-queries-in-react";
import { SelectInput } from "./SelectInput";
import { Input } from "./Input";
import { useState } from "react";

const saModels = {"Cardinal Health": ["SCD700", "ePump"], "Fresenius Kabi": ["Volumat", "Injectomat", "Agilia SP", "Agilia VP"],
"Ecomed (CTG Transducers)": ""}
const fkaShippingOptions = ["TNT", "FKA Arranged"];
const numericalOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9]

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
                <h4>Request Form Generation</h4>
                <div className="input-container">
                    <SelectInput label="Employee Requestor" optionData={staffNames}></SelectInput>
                    <SelectInput label="Service Agent" optionData={serviceAgents} onChange={changeServiceAgent}></SelectInput>
                    {serviceAgent !== "Ecomed (CTG Transducers)" && 
                        <div className="bme-model-container">
                            <Input inputType="text" identifier="bme" labelText={`BME`}></Input>
                            {saModels[serviceAgent] !== "" && <SelectInput label="Model" optionData={saModels[serviceAgent]} onChange={changeServiceAgent}></SelectInput>}
                        </div>}
                    {serviceAgent !== "Ecomed (CTG Transducers)" && <SelectInput label="Fault Description" optionData={staffNames}></SelectInput>}
                    {serviceAgent === "Fresenius Kabi" && <SelectInput label="Shipping Option" optionData={fkaShippingOptions}></SelectInput>} 
                    {serviceAgent === "Ecomed (CTG Transducers)" && 
                        <div className="transducer-qty-container">
                            <SelectInput label="US Qty" optionData={numericalOptions}></SelectInput>
                            <SelectInput label="CTG Qty" optionData={numericalOptions}></SelectInput>
                        </div>}
                    {/*<GenerateFormButton buttonText="Generate Request Form"/>*/} 
                </div>
            </form>
        </div>
    );
}