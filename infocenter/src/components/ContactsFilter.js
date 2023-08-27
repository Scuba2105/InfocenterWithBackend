import { SelectInput } from "./SelectInput";

export function ContactsFilter({selectedDepartment, pageData, onHospitalChange, onDepartmentChange, setContactPage}) {
    
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
            <SelectInput type="contacts-hospitals" defaultValue={selectedDepartment.hospital} label="Hospital" optionData={hospitalData} onChange={(e) => onHospitalChange(pageData, setContactPage, e)}></SelectInput>
            <SelectInput type="contacts-departments" defaultValue={selectedDepartment.department} label="Department" optionData={departmentData} onChange={(e) => onDepartmentChange(setContactPage, e)}></SelectInput>
        </div>
    );
}