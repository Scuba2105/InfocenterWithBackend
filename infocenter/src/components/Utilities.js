import { utilityFunctions } from "../data";

export function Utilities({children, utilityPage, onClick, setUtilityPage}) {
    
    return (
        <>
            <div className="utilities-container">
                <div className="utility-options">
                    {utilityFunctions.map((entry, index) => {
                        return (
                            <h2 key={`utility-option${index}`} className={index === utilityPage ? "utility-selected" : undefined} onClick={() => onClick(setUtilityPage, index)}>{entry}</h2>
                        )
                    })}
                </div>
                {children}
            </div>
        </>
    );
}