export function SelectInput({type, defaultValue, label, optionData, value, onChange}) {
    if (type === "form-select-input-disabled") {
        return (
            <div className={`flex-c-col ${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-container`}>
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
    else if (type === "form-select-input") {
        return (
            <div className={`form-select-input-container flex-c-col`}>
                <p className={`form-select-input-label`}>{label}</p>
                <select name={label} defaultValue={defaultValue} className={"select-input form-select-input"} onChange={onChange}>
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
            <div className={`contacts-select-container flex-c-col`}>
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
    else {
        return (
            <div className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-container`}>
                <p className={`${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select-label`}>{label === 'Hospital' ? `${label}/Region` : label}</p>
                <select name={label} value={value} className={label === 'Configuration Type' ? `select-input config-data-input ${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select` : `select-input ${label.toLowerCase().replace(/\s/ig,'-').replace(':','')}-select`} onChange={onChange}>
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

