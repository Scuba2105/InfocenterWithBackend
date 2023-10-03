import useMediaQueries from "media-queries-in-react";
import { SelectInput } from "./SelectInput";
import { Input } from "./Input";
import { TextArea } from "./TextArea";
import { useState } from "react";

const saModels = {"Cardinal Health": ["SCD700", "ePump"], "Fresenius Kabi": ["Volumat", "Injectomat", "Agilia SP", "Agilia VP"],
"Ecomed (CTG Transducers)": ""}
const fkaShippingOptions = ["TNT", "FKA Arranged"];
const numericalOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Update service agent when select input changes
function changeServiceAgent(e, setServiceAgent) {
    setServiceAgent(e.currentTarget.value);
}

export function ServiceRequestGenerator({staffNames}) {

    const [serviceAgent, setServiceAgent] = useState("Cardinal Health");

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1750px)",
        desktop: "(min-width: 1800px)"
    }); 

    const serviceAgents = Object.keys(saModels);

    return (
        <div className="request-page-container">
            <form className={mediaQueries.laptop ? `request-form-laptop` : `request-form-desktop`} style={serviceAgent === "Ecomed (CTG Transducers)" ? {width: 400 + "px"} : {width: 600 + "px"}}>
                <h4>Request Form Generation</h4>
                <div className={serviceAgent === "Ecomed (CTG Transducers)" ? "input-container" : "two-column-container"}>
                    <SelectInput label="Employee Requestor" optionData={staffNames}></SelectInput>
                    {serviceAgent !== "Ecomed (CTG Transducers)" && 
                        <div className="bme-model-container">
                            <Input inputType="text" identifier="bme" labelText={`BME`}></Input>
                            {saModels[serviceAgent] !== "" && <SelectInput label="Model" optionData={saModels[serviceAgent]} onChange={changeServiceAgent}></SelectInput>}
                        </div>}
                    <SelectInput label="Service Agent" optionData={serviceAgents} onChange={(e) => changeServiceAgent(e, setServiceAgent)}></SelectInput>
                    {serviceAgent !== "Ecomed (CTG Transducers)" && <TextArea label="Fault Description"></TextArea>}
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