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
    else if (type === "contacts-hospitals" || type === "contacts-departments") {
        return (
            <div className={`contacts-select-container`}>
                <p className={`contacts-select-label`}>{label}</p>
                <select name={label} className={"select-input contacts-select"} style={label === "Vendor" ? {width: 270 + 'px'} : null} value={defaultValue} onChange={onChange}>
                    {optionData.map((hospital, index) => {
                        return (
                        <option key={index} value={hospital}>{hospital}</option>
                        );
                    })}
                </select>  
            </div>
        );
    }
    else if (type === "vendor") {
        return (
            <div className={`supplier-select-container`}>
                <p className={`supplier-select-label`}>{label === 'Hospital' ? `${label}/Region` : label}</p>
                <select name={label} className={label === 'Configuration Type' ? `select-input config-data-input supplier-select` : `select-input supplier-select`} onChange={onChange}>
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

