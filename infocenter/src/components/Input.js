

export function Input({ inputType, identifier, labelText, placeholdertext }) {
    return (
        <div className={identifier}>
            <label className={`${identifier}-label`}>{labelText}</label>
            <input type={inputType} className={`${inputType}-input ${identifier}-input`} placeholder={placeholdertext}></input>
        </div>
    );
}