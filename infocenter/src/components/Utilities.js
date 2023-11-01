import { utilityFunctions } from "../data";

export function Utilities({children, utilityPage, onClick, setUtilityPage}) {
    
    return (
        <>
            <div className="utilities-container size-100">
                <div className="utility-options size-100">
                    {utilityFunctions.map((entry, index) => {
                        return (
                            <h2 key={`utility-option${index}`} className={index === utilityPage ? "utility-selected flex-c size-100" : "flex-c size-100"} onClick={() => onClick(setUtilityPage, index)}>{entry}</h2>
                        )
                    })}
                </div>
                {children}
            </div>
        </>
    );
}