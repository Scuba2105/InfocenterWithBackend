import { SelectInput } from "./SelectInput";

export function ContactsFilter({selectedDepartment, pageData, onHospitalChange, onDepartmentChange}) {
    
    const hospitalData = pageData.reduce((acc, entry) => {
        if (!acc.includes(`${entry.hospital}`)) {
            acc.push(entry.hospital);
        }
        return acc
    }, [])

    const departmentData = pageData.reduce((acc, entry) => {
        if (entry.hospital === selectedDepartment.hospital && !acc.includes(`${entry.department}`)) {
            acc.push(entry.department);
        }
        return acc
    }, [])
    
    return (
        <div className="contacts-filter-container">
            <SelectInput type="contacts" defaultValue={selectedDepartment.hospital} label="Hospital" optionData={hospitalData} onChange={(e) => onHospitalChange(pageData, e)}></SelectInput>
            <SelectInput type="contacts" defaultValue={selectedDepartment.department} label="Department" optionData={departmentData} onChange={onDepartmentChange}></SelectInput>
        </div>
    );
}