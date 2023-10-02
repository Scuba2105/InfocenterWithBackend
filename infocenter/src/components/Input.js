

export function Input({ type, inputType, identifier, labelText, defaultValue, placeholdertext, onChange, uniqueId, name }) {
    if (type === "disabled") {
        return (
            <div className={identifier}>
                <label className={`${identifier}-label`}>{labelText}</label>
                <input type={inputType} defaultValue={defaultValue} disabled id={labelText.toLowerCase().replace(/\s/ig, '-')} className={`${inputType}-input ${identifier}-input`} placeholder={placeholdertext}></input>
            </div>
        );
    }    
    else if (type === "update") {
        return (
            <div className={identifier}>
                <label className={`${identifier}-label`}>{labelText}</label>
                <input type={inputType} defaultValue={defaultValue} id={labelText.toLowerCase().replace(/\s/ig, '-')} className={`${inputType}-input ${identifier}-input`} placeholder={placeholdertext}></input>
            </div>
        );
    }
    else if (type === "device-update-file") {
        return (
            <div className={identifier}>
                <label className={`${identifier}-label`}>{labelText}</label>
                <input type={inputType} id={uniqueId} name={name} className={`${inputType}-input ${identifier}-input`} placeholder={placeholdertext} onChange={onChange}></input>
            </div>
        );
    }
    else {
        return (
            <div className={identifier}>
                <label className={`${identifier}-label`}>{labelText}</label>
                <input type={inputType} id={labelText.toLowerCase().replace(/\s/ig, '-')} className={`${inputType}-input ${identifier}-input`} placeholder={placeholdertext} onChange={onChange}></input>
            </div>
        );
    }
}