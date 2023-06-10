export function SelectInput({label, optionData, onChange}) {
    return (
        <div className="select-container">
            <p className="select-label">{label}</p>
            <select name={label} className={`${label.toLowerCase()}-select`} onChange={onChange}>
                {optionData.map((hospital) => {
                    return (
                    <option key={hospital} value={hospital}>{hospital}</option>
                    );
                })}
            </select>           
        </div>
    );
} 

