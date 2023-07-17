export function SelectInput({type, defaultValue, label, optionData, onChange}) {
    if (type === "disabled") {
        return (
            <div className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-container`}>
                <p className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-label`}>{label === 'Hospital' ? `${label}/Region` : label}</p>
                <select name={label} disabled defaultValue={defaultValue} className={label === 'Configuration Type' ? `select-input config-data-input ${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select` : `select-input ${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select`} onChange={onChange}>
                    {optionData.map((hospital, index) => {
                        return (
                        <option key={index} value={hospital}>{hospital}</option>
                        );
                    })}
                </select>           
            </div>
        );
    }
    else if (type === "update") {
        return (
            <div className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-container`}>
                <p className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-label`}>{label === 'Hospital' ? `${label}/Region` : label}</p>
                <select name={label} defaultValue={defaultValue} className={label === 'Configuration Type' ? `select-input config-data-input ${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select` : `select-input ${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select`} onChange={onChange}>
                    {optionData.map((hospital, index) => {
                        return (
                        <option key={index} value={hospital}>{hospital}</option>
                        );
                    })}
                </select>           
            </div>
        );
    }
    else {
        return (
            <div className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-container`}>
                <p className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-label`}>{label === 'Hospital' ? `${label}/Region` : label}</p>
                <select name={label} className={label === 'Configuration Type' ? `select-input config-data-input ${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select` : `select-input ${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select`} onChange={onChange}>
                    {optionData.map((hospital, index) => {
                        return (
                        <option key={index} value={hospital}>{hospital}</option>
                        );
                    })}
                </select>           
            </div>
        );
    }
} 

