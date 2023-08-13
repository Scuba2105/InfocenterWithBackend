import useMediaQueries from "media-queries-in-react";
import { SelectInput } from "./SelectInput";
import { Input } from "./Input";
import { useState } from "react";

const serviceAgents = ["Cardinal Health", "Ecomed (CTG Transducers)", "Fresenius Kabi"]

export function ServiceRequestGenerator({staffNames}) {

    const [serviceAgent, setServiceAgent] = useState("Cardinal Health");

    function changeServiceAgent(e) {
        setServiceAgent(e.currentTarget.value);
    }

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    }); 

    return (
        <div className="request-page-container">
            <form className={mediaQueries.laptop ? `request-form-laptop` : `request-form-desktop`}>
                <h4>Request Generation Form</h4>
                <div className="input-container">
                    <SelectInput label="Employee Requestor" optionData={staffNames}></SelectInput>
                    <SelectInput label="Service Agent" optionData={serviceAgents} onChange={changeServiceAgent}></SelectInput>
                    <Input inputType="text" identifier="bme" labelText={`BME`}></Input>
                    {/*<GenerateFormButton buttonText="Generate Request Form"/>*/} 
                </div>                
            </form>
        </div>
    );
}