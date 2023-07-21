import { SelectInput } from "./SelectInput";
import { utilityFunctions } from "../data";

export function Utilities({children, onChange}) {
    return (
        <>
            <div className="utilities-container">
                <SelectInput label="Utilities" optionData={utilityFunctions} onChange={onChange} />
                {children}
            </div>
        </>
    );
}