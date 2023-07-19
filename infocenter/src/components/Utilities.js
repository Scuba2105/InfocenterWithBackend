import { SelectInput } from "./SelectInput";

const utilityFunctions = ["Service Manual Administration", "Genius 3 Thermometer Management"] 

export function Utilities() {
    return (
        <div className="utilities-container">
            <SelectInput label="Utilities" optionData={utilityFunctions} />
        </div>
    );
}