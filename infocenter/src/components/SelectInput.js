export function SelectInput({label, optionData, onChange}) {
    return (
        <div className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-container`}>
            <p className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-label`}>{label}</p>
            <select name={label} className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select`} onChange={onChange}>
                {optionData.map((hospital) => {
                    return (
                    <option key={hospital} value={hospital}>{hospital}</option>
                    );
                })}
            </select>           
        </div>
    );
} 

